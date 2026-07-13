import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { TicketScan, ScanType } from './entities/ticket-scan.entity';
import { GateTicket } from './entities/gate-ticket.entity';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketScan)
    private readonly ticketScanRepository: Repository<TicketScan>,
    @InjectRepository(GateTicket)
    private readonly gateTicketRepository: Repository<GateTicket>,
  ) {}

  // Lấy danh sách vé đã bán (chỉ lấy vé thuộc đơn đã PAID)
  async findAll(filter: FilterTicketsDto) {
    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.gateTicket', 'gateTicket')
      .leftJoin('ticket.orderItemId', 'orderItem')
      .leftJoin('orderItem.orderId', 'order')
      .where('order.status = :orderStatus', { orderStatus: 'PAID' })
      .select([
        'ticket.id',
        'ticket.ticketCode',
        'ticket.status',
        'ticket.admitsAdult',
        'ticket.admitsChild',
        'ticket.validDate',
        'ticket.createdAt',
        'gateTicket.name',
        'gateTicket.type',
        'gateTicket.isCombo',
        'orderItem.price',
      ])
      .orderBy('ticket.createdAt', 'DESC');

    if (filter.status) {
      queryBuilder.andWhere('ticket.status = :status', { status: filter.status });
    }

    if (filter.type === 'SINGLE') {
      queryBuilder.andWhere('gateTicket.isCombo = :isCombo', { isCombo: 0 });
    } else if (filter.type === 'COMBO') {
      queryBuilder.andWhere('gateTicket.isCombo = :isCombo', { isCombo: 1 });
    }

    return queryBuilder.getMany();
  }

  // Thống kê tổng quan cho trang doanh thu vé
  async getStats() {
    const result = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoin('ticket.orderItemId', 'orderItem')
      .leftJoin('orderItem.orderId', 'order')
      .select('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN ticket.status = :active THEN 1 ELSE 0 END)',
        'unused',
      )
      .addSelect(
        'SUM(CASE WHEN ticket.status IN (:expired, :cancelled) THEN 1 ELSE 0 END)',
        'used',
      )
      .addSelect('COALESCE(SUM(orderItem.price), 0)', 'revenue')
      .where('order.status = :orderStatus', { orderStatus: 'PAID' })
      .setParameters({
        active: TicketStatus.ACTIVE,
        expired: TicketStatus.EXPIRED,
        cancelled: TicketStatus.CANCELLED,
      })
      .getRawOne();

    return {
      total: parseInt(result.total || '0'),
      unused: parseInt(result.unused || '0'),
      used: parseInt(result.used || '0'),
      revenue: parseFloat(result.revenue || '0'),
    };
  }

  // Quét vé tại cổng
  async scanTicket(dto: ScanTicketDto) {
    const queryRunner = this.ticketRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Khóa dòng vé lại để tránh 2 request quét trùng nhau cùng lúc
      const ticket = await queryRunner.manager.findOne(Ticket, {
        where: { ticketCode: dto.ticketCode },
        lock: { mode: 'pessimistic_write' },
      });

      if (!ticket) {
        await queryRunner.rollbackTransaction();
        return { ok: false, message: 'TICKET_NOT_FOUND', scanType: null };
      }

      if (ticket.status !== TicketStatus.ACTIVE) {
        await queryRunner.rollbackTransaction();
        return { ok: false, message: `TICKET_${ticket.status}`, scanType: null };
      }

      const today = new Date().toISOString().split('T')[0];
      const validDate = ticket.validDate.toISOString().split('T')[0];
      
      if (validDate !== today) {
        await queryRunner.rollbackTransaction();
        return { ok: false, message: 'TICKET_NOT_VALID_TODAY', scanType: null };
      }

      // Lấy lần quét gần nhất để biết vé đang Ở TRONG hay Ở NGOÀI
      const lastScan = await queryRunner.manager.findOne(TicketScan, {
        where: { ticketId: ticket.id },
        order: { scannedAt: 'DESC', id: 'DESC' },
      });

      // Chưa quet lần nào hoặc lần trước là OUT -> lần này là IN
      // Lần trước là IN -> lần này là OUT
      const scanType = !lastScan || lastScan.scanType === ScanType.OUT ? ScanType.IN : ScanType.OUT;

      const ticketScan = queryRunner.manager.create(TicketScan, {
        ticketId: ticket.id,
        scanType,
        gateName: dto.gateName,
        staffId: dto.staffId,
      });

      await queryRunner.manager.save(TicketScan, ticketScan);

      await queryRunner.commitTransaction();

      return { ok: true, message: 'SCANNED', scanType };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { ok: false, message: 'ERROR', scanType: null };
    } finally {
      await queryRunner.release();
    }
  }

  // Sinh vé từ order sau khi thanh toán thành công
  async generateByOrder(orderId: number) {
    const queryRunner = this.ticketRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lấy các order_items của order
      const orderItems = await queryRunner.manager.query(
        `
        SELECT oi.id, oi.gate_ticket_id, oi.quantity, oi.price,
               gt.admits_adult, gt.admits_child
        FROM order_items oi
        JOIN gate_tickets gt ON gt.id = oi.gate_ticket_id
        WHERE oi.order_id = ?
        `,
        [orderId],
      );

      const validDate = new Date();
      const datePrefix = validDate.toISOString().slice(0, 10).replace(/-/g, '');
      const prefix = `QR-${datePrefix}-`;

      for (const item of orderItems) {
        // Sinh quantity tickets cho mỗi order_item
        for (let i = 0; i < item.quantity; i++) {
          // Tạo ticket code unique
          const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          const ticketCode = `${prefix}${randomNum}`;

          // Kiểm tra trùng lặp
          const existing = await queryRunner.manager.findOne(Ticket, {
            where: { ticketCode },
          });
          if (existing) {
            i--; // thử lại
            continue;
          }

          const ticket = queryRunner.manager.create(Ticket, {
            orderItemId: item.id,
            gateTicketId: item.gate_ticket_id,
            ticketCode,
            admitsAdult: item.admits_adult,
            admitsChild: item.admits_child,
            validDate,
            status: TicketStatus.ACTIVE,
          });

          await queryRunner.manager.save(Ticket, ticket);
        }
      }

      await queryRunner.commitTransaction();
      return { message: 'Tickets generated successfully', count: orderItems.length };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Lấy vé theo order_id
  async getTicketsByOrder(orderId: number) {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.gateTicket', 'gateTicket')
      .leftJoin('ticket.orderItemId', 'orderItem')
      .where('orderItem.orderId = :orderId', { orderId })
      .orderBy('ticket.id', 'ASC')
      .getMany();
  }
}
