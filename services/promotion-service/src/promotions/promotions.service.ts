import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion, PromotionStatus } from './entities/promotion.entity';
import { PromotionGateTicket } from './entities/promotion-gate-ticket.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApplyPromotionDto } from './dto/apply-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(PromotionGateTicket)
    private readonly promotionGateTicketRepository: Repository<PromotionGateTicket>,
  ) {}

  // Lấy tất cả promotions
  async findAll() {
    return this.promotionRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.gateTickets', 'pgt')
      .orderBy('p.id', 'DESC')
      .getMany();
  }

  // Lấy promotion theo id
  async findById(id: number) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['gateTickets'],
    });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
  }

  // Tìm promotion theo code hợp lệ
  async findByCode(code: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.promotionRepository.findOne({
      where: {
        code: code.toUpperCase(),
        status: PromotionStatus.ACTIVE,
      },
      relations: ['gateTickets'],
    });
  }

  // Tạo promotion mới
  async create(dto: CreatePromotionDto) {
    const queryRunner = this.promotionRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const promotion = queryRunner.manager.create(Promotion, {
        code: dto.code.toUpperCase(),
        discount: dto.discount,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: PromotionStatus.ACTIVE,
      });

      const savedPromotion = await queryRunner.manager.save(Promotion, promotion);

      // Set scope nếu có gateTicketIds
      if (dto.gateTicketIds && dto.gateTicketIds.length > 0) {
        for (const gateTicketId of dto.gateTicketIds) {
          const pgt = queryRunner.manager.create(PromotionGateTicket, {
            promotionId: savedPromotion.id,
            gateTicketId,
          });
          await queryRunner.manager.save(PromotionGateTicket, pgt);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(savedPromotion.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Cập nhật promotion
  async update(id: number, dto: UpdatePromotionDto) {
    const queryRunner = this.promotionRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const promotion = await queryRunner.manager.findOne(Promotion, {
        where: { id },
      });
      if (!promotion) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('Promotion not found');
      }

      promotion.code = dto.code.toUpperCase();
      promotion.discount = dto.discount;
      promotion.startDate = new Date(dto.startDate);
      promotion.endDate = new Date(dto.endDate);
      promotion.status = dto.status;

      await queryRunner.manager.save(Promotion, promotion);

      // Xóa scope cũ và set mới
      await queryRunner.manager.delete(PromotionGateTicket, { promotionId: id });

      if (dto.gateTicketIds && dto.gateTicketIds.length > 0) {
        for (const gateTicketId of dto.gateTicketIds) {
          const pgt = queryRunner.manager.create(PromotionGateTicket, {
            promotionId: id,
            gateTicketId,
          });
          await queryRunner.manager.save(PromotionGateTicket, pgt);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Vô hiệu hóa promotion
  async disable(id: number) {
    const promotion = await this.promotionRepository.findOne({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    promotion.status = PromotionStatus.EXPIRED;
    return this.promotionRepository.save(promotion);
  }

  // Áp dụng promotion cho order
  async apply(dto: ApplyPromotionDto) {
    const promotion = await this.findByCode(dto.code);
    if (!promotion) {
      return { success: false, message: 'Mã giảm giá không hợp lệ' };
    }

    const today = new Date().toISOString().split('T')[0];
    const startDate = promotion.startDate.toISOString().split('T')[0];
    const endDate = promotion.endDate.toISOString().split('T')[0];

    if (today < startDate || today > endDate) {
      return { success: false, message: 'Mã giảm giá đã hết hạn hoặc chưa có hiệu lực' };
    }

    // Tính base total từ order items trong phạm vi áp dụng
    const baseTotal = await this.calculateBaseTotal(dto.orderId, promotion.id);
    if (baseTotal <= 0) {
      return { success: false, message: 'Không có sản phẩm phù hợp để áp mã' };
    }

    const discount = (baseTotal * promotion.discount) / 100;

    // Lưu vào promotion_order
    await this.promotionRepository.manager.query(
      `
      INSERT INTO promotion_order (promotion_id, order_id, discount_amount)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE discount_amount = ?
      `,
      [promotion.id, dto.orderId, discount, discount],
    );

    // Cập nhật total price của order
    await this.updateOrderTotal(dto.orderId);

    return { success: true, discount };
  }

  // Tính base total theo phạm vi áp dụng
  private async calculateBaseTotal(orderId: number, promotionId: number) {
    const result = await this.promotionRepository.manager.query(
      `
      SELECT SUM(oi.quantity * oi.price) AS total
      FROM order_items oi
      WHERE oi.order_id = ?
        AND (
              NOT EXISTS (
                  SELECT 1 FROM promotion_gate_tickets
                  WHERE promotion_id = ?
              )
              OR oi.gate_ticket_id IN (
                  SELECT gate_ticket_id FROM promotion_gate_tickets
                  WHERE promotion_id = ?
              )
            )
      `,
      [orderId, promotionId, promotionId],
    );
    return parseFloat(result[0]?.total || '0');
  }

  // Cập nhật total price của order
  private async updateOrderTotal(orderId: number) {
    await this.promotionRepository.manager.query(
      `
      UPDATE orders o
      SET total_price = (
        SELECT SUM(oi.quantity * oi.price)
        FROM order_items oi
        WHERE oi.order_id = o.id
      ) - COALESCE(
        (SELECT discount_amount FROM promotion_order WHERE order_id = o.id LIMIT 1),
        0
      )
      WHERE o.id = ?
      `,
      [orderId],
    );
  }

  // Lấy danh sách gate tickets
  async getAllGateTickets() {
    return this.promotionRepository.manager.query(
      `
      SELECT id, name, is_combo FROM gate_tickets WHERE status = 'ACTIVE' ORDER BY id ASC
      `,
    );
  }

  // Thống kê: tổng số lần sử dụng
  async getTotalUsed(promotionId: number) {
    const result = await this.promotionRepository.manager.query(
      `
      SELECT COUNT(*) AS total FROM promotion_order WHERE promotion_id = ?
      `,
      [promotionId],
    );
    return parseInt(result[0]?.total || '0');
  }

  // Thống kê: tổng tiền đã giảm
  async getTotalDiscount(promotionId: number) {
    const result = await this.promotionRepository.manager.query(
      `
      SELECT COALESCE(SUM(discount_amount), 0) AS total FROM promotion_order WHERE promotion_id = ?
      `,
      [promotionId],
    );
    return parseFloat(result[0]?.total || '0');
  }
}
