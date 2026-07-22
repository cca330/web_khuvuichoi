import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { TicketScan, ScanType } from './entities/ticket-scan.entity';

import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { FilterRevenueDto } from './dto/filter-revenue.dto';
import { CalculateBaseTotalDto } from './dto/calculate-base-total.dto';
import { ApplyPromotionOrderDto } from './dto/apply-promotion-order.dto';
import { GateTicket, GateTicketStatus } from './entities/gate-ticket.entity';
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketScan)
    private readonly ticketScanRepository: Repository<TicketScan>,
    @InjectRepository(GateTicket)
    private readonly gateTicketRepository: Repository<GateTicket>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  // Lấy danh sách vé đã bán (chỉ lấy vé thuộc đơn đã PAID)
  async findAll(filter: FilterTicketsDto) {
    let query = `
    SELECT
      t.id AS id,
      t.ticket_code AS code,
      t.status AS status,
      t.created_at AS createdAt,
      oi.order_id AS orderId,
      oi.price AS price,
      gt.name AS name,
      CASE WHEN gt.is_combo = 1 THEN 'COMBO' ELSE 'SINGLE' END AS type
    FROM tickets t
    JOIN order_items oi ON oi.id = t.order_item_id
    JOIN orders o ON o.id = oi.order_id
    JOIN gate_tickets gt ON gt.id = t.gate_ticket_id
    WHERE o.status = 'PAID'
  `;

    const params: any[] = [];

    if (filter.status) {
      query += ` AND t.status = ?`;
      params.push(filter.status);
    }

    if (filter.type === 'SINGLE') {
      query += ` AND gt.is_combo = 0`;
    } else if (filter.type === 'COMBO') {
      query += ` AND gt.is_combo = 1`;
    }

    query += ` ORDER BY t.created_at DESC`;

    return this.ticketRepository.manager.query(query, params);
  }

  // Thống kê tổng quan (dùng cho trang danh sách vé)
  async getStats() {
    const result = await this.ticketRepository.manager.query(
      `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN t.status = 'ACTIVE' THEN 1 ELSE 0 END) AS unused,
        SUM(CASE WHEN t.status IN ('EXPIRED','CANCELLED') THEN 1 ELSE 0 END) AS used,
        COALESCE(SUM(oi.price), 0) AS revenue
      FROM tickets t
      JOIN order_items oi ON oi.id = t.order_item_id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status = 'PAID'
      `,
    );

    const row = result[0];
    return {
      total: parseInt(row.total || '0'),
      unused: parseInt(row.unused || '0'),
      used: parseInt(row.used || '0'),
      revenue: parseFloat(row.revenue || '0'),
    };
  }

  // Lấy vé theo order_id
  async getTicketsByOrder(orderId: number) {
    const itemIds = await this.ticketRepository.manager.query(
      `SELECT id FROM order_items WHERE order_id = ?`,
      [orderId],
    );
    const ids = itemIds.map((r: any) => r.id);
    if (ids.length === 0) return [];

    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.gateTicket', 'gateTicket')
      .where('ticket.orderItemId IN (:...ids)', { ids })
      .orderBy('ticket.id', 'ASC')
      .getMany();
  }

  // Quét vé tại cổng
  async scanTicket(dto: ScanTicketDto) {
    const queryRunner =
      this.ticketRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
        return {
          ok: false,
          message: `TICKET_${ticket.status}`,
          scanType: null,
        };
      }

      const today = new Date().toISOString().split('T')[0];
      const validDate = ticket.validDate.toISOString().split('T')[0];

      if (validDate !== today) {
        await queryRunner.rollbackTransaction();
        return { ok: false, message: 'TICKET_NOT_VALID_TODAY', scanType: null };
      }

      const lastScan = await queryRunner.manager.findOne(TicketScan, {
        where: { ticketId: ticket.id },
        order: { scannedAt: 'DESC', id: 'DESC' },
      });

      const scanType =
        !lastScan || lastScan.scanType === ScanType.OUT
          ? ScanType.IN
          : ScanType.OUT;

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
    const queryRunner =
      this.ticketRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
        for (let i = 0; i < item.quantity; i++) {
          const randomNum = Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, '0');
          const ticketCode = `${prefix}${randomNum}`;

          const existing = await queryRunner.manager.findOne(Ticket, {
            where: { ticketCode },
          });
          if (existing) {
            i--;
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
      return {
        message: 'Tickets generated successfully',
        count: orderItems.length,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ===== Các method phục vụ revenue-service gọi sang =====

  async getAvailableYears() {
    const result = await this.ticketRepository.manager.query(`
      SELECT DISTINCT DATE_FORMAT(o.paid_at, '%Y') AS year
      FROM orders o
      WHERE o.status = 'PAID'
      ORDER BY year DESC
    `);
    return result.map((row: any) => parseInt(row.year));
  }

  async getMonthlyRevenue(filter: FilterRevenueDto) {
    const currentYear = new Date().getFullYear();
    const selectedYear = filter.year || currentYear;
    const selectedType = filter.type || 'total';

    let query = '';
    if (selectedType === 'total') {
      query = `
        SELECT DATE_FORMAT(o.paid_at, '%m') AS month_num,
               DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
               COALESCE(SUM(o.total_price), 0) AS total
        FROM orders o
        WHERE o.status = 'PAID' AND DATE_FORMAT(o.paid_at, '%Y') = ?
        GROUP BY month_num, month_display
        ORDER BY month_num ASC
      `;
    } else {
      query = `
        SELECT DATE_FORMAT(o.paid_at, '%m') AS month_num,
               DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
               COALESCE(SUM(oi.price), 0) AS total
        FROM tickets t
        JOIN order_items oi ON t.order_item_id = oi.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'PAID' AND t.status != 'CANCELLED'
          AND DATE_FORMAT(o.paid_at, '%Y') = ?
        GROUP BY month_num, month_display
        ORDER BY month_num ASC
      `;
    }

    const result = await this.ticketRepository.manager.query(query, [
      selectedYear,
    ]);

    const monthlyData: Record<string, number> = {};
    for (let m = 1; m <= 12; m++) {
      monthlyData[`${m.toString().padStart(2, '0')}/${selectedYear}`] = 0;
    }
    result.forEach((row: any) => {
      if (monthlyData.hasOwnProperty(row.month_display)) {
        monthlyData[row.month_display] = parseFloat(row.total);
      }
    });

    return { year: selectedYear, type: selectedType, data: monthlyData };
  }

  async getGateTicketDetails() {
    const result = await this.ticketRepository.manager.query(`
      SELECT gt.id, gt.name, gt.price,
             COUNT(CASE WHEN o.status = 'PAID' AND t.status != 'CANCELLED' THEN t.id END) AS total_tickets,
             COALESCE(SUM(CASE WHEN o.status = 'PAID' AND t.status != 'CANCELLED' THEN oi.price END), 0) AS revenue
      FROM gate_tickets gt
      LEFT JOIN tickets t ON t.gate_ticket_id = gt.id
      LEFT JOIN order_items oi ON t.order_item_id = oi.id
      LEFT JOIN orders o ON oi.order_id = o.id
      GROUP BY gt.id, gt.name, gt.price
      ORDER BY gt.id ASC
    `);

    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      totalTickets: parseInt(row.total_tickets || '0'),
      revenue: parseFloat(row.revenue || '0'),
    }));
  }

  async getOverview() {
    const result = await this.ticketRepository.manager.query(`
      SELECT
        COUNT(DISTINCT o.id) AS total_orders,
        COALESCE(SUM(CASE WHEN o.status = 'PAID' THEN o.total_price ELSE 0 END), 0) AS total_revenue,
        COUNT(DISTINCT CASE WHEN o.status = 'PAID' THEN o.id END) AS paid_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'PENDING' THEN o.id END) AS pending_orders
      FROM orders o
    `);

    return {
      totalOrders: parseInt(result[0]?.total_orders || '0'),
      totalRevenue: parseFloat(result[0]?.total_revenue || '0'),
      paidOrders: parseInt(result[0]?.paid_orders || '0'),
      pendingOrders: parseInt(result[0]?.pending_orders || '0'),
    };
  }

  // Lấy danh sách gate tickets đang active
  async getActiveGateTickets() {
    return this.ticketRepository.manager.query(
      `SELECT id, name, is_combo FROM gate_tickets WHERE status = 'ACTIVE' ORDER BY id ASC`,
    );
  }

  // Tính base total theo phạm vi áp dụng của 1 promotion
  async calculateBaseTotal(dto: CalculateBaseTotalDto) {
    const result = await this.ticketRepository.manager.query(
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
      [dto.orderId, dto.promotionId, dto.promotionId],
    );
    return { total: parseFloat(result[0]?.total || '0') };
  }
  // Thống kê: tổng số lần 1 promotion được sử dụng
  async getPromotionTotalUsed(promotionId: number) {
    const result = await this.ticketRepository.manager.query(
      `SELECT COUNT(*) AS total FROM promotion_order WHERE promotion_id = ?`,
      [promotionId],
    );
    return { total: parseInt(result[0]?.total || '0') };
  }

  // Thống kê: tổng tiền đã giảm của 1 promotion
  async getPromotionTotalDiscount(promotionId: number) {
    const result = await this.ticketRepository.manager.query(
      `SELECT COALESCE(SUM(discount_amount), 0) AS total FROM promotion_order WHERE promotion_id = ?`,
      [promotionId],
    );
    return { total: parseFloat(result[0]?.total || '0') };
  }

  // Ghi/update promotion_order + tự cập nhật lại total_price của order (2 việc luôn đi cùng nhau nên gộp 1 transaction)
  async applyPromotionToOrder(dto: ApplyPromotionOrderDto) {
    const queryRunner =
      this.ticketRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.query(
        `
      INSERT INTO promotion_order (promotion_id, order_id, discount_amount)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE discount_amount = ?
      `,
        [dto.promotionId, dto.orderId, dto.discountAmount, dto.discountAmount],
      );

      await queryRunner.manager.query(
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
        [dto.orderId],
      );

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ==================== CART / ORDER METHODS ====================

  // Lấy hoặc tạo order PENDING cho user
  async getOrCreatePendingOrder(userId: number): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: { userId, status: OrderStatus.PENDING },
    });

    if (!order) {
      const newOrder = this.orderRepository.create({
        userId,
        status: OrderStatus.PENDING,
        totalPrice: 0,
      });
      order = await this.orderRepository.save(newOrder);
    }

    return order;
  }

  // Lấy danh sách gate tickets đang hoạt động
  async getGateTickets(): Promise<GateTicket[]> {
    return this.gateTicketRepository.find({
      where: { status: GateTicketStatus.ACTIVE }, // ✅ dùng enum thay vì chuỗi 'ACTIVE'
      order: { id: 'ASC' },
    });
  }

  // Thêm vé cổng vào giỏ hàng
  async addGateToCart(userId: number, gateTicketId: number): Promise<Order> {
    const order = await this.getOrCreatePendingOrder(userId);
    const gateTicket = await this.gateTicketRepository.findOne({
      where: { id: gateTicketId },
    });

    if (!gateTicket) {
      throw new NotFoundException('Vé cổng không tồn tại');
    }

    let orderItem = await this.orderItemRepository.findOne({
      where: { orderId: order.id, gateTicketId },
    });

    if (orderItem) {
      orderItem.quantity += 1;
      await this.orderItemRepository.save(orderItem);
    } else {
      orderItem = this.orderItemRepository.create({
        orderId: order.id,
        gateTicketId,
        quantity: 1,
        price: gateTicket.price,
      });
      await this.orderItemRepository.save(orderItem);
    }

    await this.updateOrderTotal(order.id);

    const updatedOrder = await this.orderRepository.findOne({
      where: { id: order.id },
    });
    if (!updatedOrder) {
      throw new NotFoundException('Order not found sau khi cập nhật');
    }
    return updatedOrder;
  }

  // Cập nhật số lượng vé trong giỏ
  async updateCartItemQuantity(
    itemId: number,
    action: 'plus' | 'minus',
  ): Promise<void> {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item không tồn tại');
    }

    if (action === 'plus') {
      item.quantity += 1;
      await this.orderItemRepository.save(item);
    } else if (action === 'minus') {
      if (item.quantity <= 1) {
        await this.orderItemRepository.delete(itemId);
      } else {
        item.quantity -= 1;
        await this.orderItemRepository.save(item);
      }
    }

    // Cập nhật tổng tiền
    await this.updateOrderTotal(item.orderId);
  }

  // Xóa item khỏi giỏ hàng
  async deleteCartItem(itemId: number): Promise<void> {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item không tồn tại');
    }

    const orderId = item.orderId;
    await this.orderItemRepository.delete(itemId);
    await this.updateOrderTotal(orderId);
  }

  // Lấy thông tin giỏ hàng
  async getCart(userId: number) {
    const order = await this.getOrCreatePendingOrder(userId);

    const items = await this.orderItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.gateTicket', 'gateTicket')
      .where('item.orderId = :orderId', { orderId: order.id })
      .getMany();

    const baseTotal = await this.calculateBaseTotalOnly(order.id);
    const discount = await this.getDiscountByOrder(order.id);
    const finalTotal = Math.max(0, baseTotal - discount);

    return {
      order,
      items: items.map((item) => ({
        id: item.id,
        gateTicketId: item.gateTicketId,
        name: item.gateTicket?.name || 'Unknown',
        isCombo: item.gateTicket?.isCombo || false,
        admitsAdult: item.gateTicket?.admitsAdult || 0,
        admitsChild: item.gateTicket?.admitsChild || 0,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      baseTotal,
      discount,
      finalTotal,
    };
  }

  // Lấy lịch sử đơn hàng đã thanh toán
  async getOrderHistory(userId: number) {
    const orders = await this.orderRepository.find({
      where: { userId, status: OrderStatus.PAID },
      order: { paidAt: 'DESC' },
    });

    return Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemRepository
          .createQueryBuilder('item')
          .leftJoinAndSelect('item.gateTicket', 'gateTicket')
          .where('item.orderId = :orderId', { orderId: order.id })
          .getMany();

        const discount = await this.getDiscountByOrder(order.id);

        return {
          id: order.id,
          totalPrice: order.totalPrice,
          discount,
          finalTotal: order.totalPrice,

          status: order.status,
          createdAt: order.createdAt,
          paidAt: order.paidAt,
          items: items.map((item) => ({
            name: item.gateTicket?.name || 'Unknown',
            quantity: item.quantity,
            price: item.price,
          })),
        };
      }),
    );
  }

  // Lấy chi tiết đơn hàng
  async getOrderDetail(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    const items = await this.orderItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.gateTicket', 'gateTicket')
      .where('item.orderId = :orderId', { orderId: order.id })
      .getMany();

    const discount = await this.getDiscountByOrder(order.id);

    return {
      id: order.id,
      totalPrice: order.totalPrice,
      discount,
      finalTotal: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      items: items.map((item) => ({
        id: item.id,
        gateTicketId: item.gateTicketId,
        name: item.gateTicket?.name || 'Unknown',
        isCombo: item.gateTicket?.isCombo || false,
        admitsAdult: item.gateTicket?.admitsAdult || 0,
        admitsChild: item.gateTicket?.admitsChild || 0,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
    };
  }

  // Thanh toán đơn hàng
  async checkout(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId, status: OrderStatus.PENDING },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại hoặc đã thanh toán');
    }

    // Kiểm tra giỏ hàng không trống
    const itemCount = await this.orderItemRepository.count({
      where: { orderId: order.id },
    });

    if (itemCount === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    // Simulate payment success - trong thực tế sẽ gọi API thanh toán
    const paymentSuccess = true;

    if (paymentSuccess) {
      // Cập nhật trạng thái đơn hàng
      order.status = OrderStatus.PAID;
      order.paidAt = new Date();

      // Tính lại total sau khi áp dụng khuyến mãi
      const baseTotal = await this.calculateBaseTotalOnly(order.id);
      const discount = await this.getDiscountByOrder(order.id);
      order.totalPrice = Math.max(0, baseTotal - discount);

      await this.orderRepository.save(order);

      // Generate tickets
      await this.generateByOrder(order.id);

      return { success: true, orderId: order.id };
    } else {
      order.status = OrderStatus.FAILED;
      await this.orderRepository.save(order);
      throw new BadRequestException('Thanh toán thất bại');
    }
  }

  // Helper: Cập nhật tổng tiền đơn hàng
  private async updateOrderTotal(orderId: number): Promise<void> {
    const result = await this.orderItemRepository
      .createQueryBuilder('item')
      .select('SUM(item.quantity * item.price)', 'total')
      .where('item.orderId = :orderId', { orderId })
      .getRawOne();

    const total = parseFloat(result?.total || '0');

    await this.orderRepository.update(orderId, { totalPrice: total });
  }

  // Helper: Tính tổng tiền gốc (chưa giảm)
  private async calculateBaseTotalOnly(orderId: number): Promise<number> {
    const result = await this.orderItemRepository
      .createQueryBuilder('item')
      .select('SUM(item.quantity * item.price)', 'total')
      .where('item.orderId = :orderId', { orderId })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  // Helper: Lấy discount của đơn hàng
  private async getDiscountByOrder(orderId: number): Promise<number> {
    const result = await this.orderRepository.manager.query(
      `SELECT COALESCE(discount_amount, 0) as discount
       FROM promotion_order WHERE order_id = ? LIMIT 1`,
      [orderId],
    );

    return parseFloat(result[0]?.discount || '0');
  }
}
