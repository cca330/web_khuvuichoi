import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FilterRevenueDto } from './dto/filter-revenue.dto';

@Injectable()
export class RevenueService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // Lấy danh sách năm có dữ liệu
  async getAvailableYears() {
    const result = await this.dataSource.query(`
      SELECT DISTINCT DATE_FORMAT(o.paid_at, '%Y') AS year
      FROM orders o
      WHERE o.status = 'PAID'
      ORDER BY year DESC
    `);
    return result.map((row: any) => parseInt(row.year));
  }

  // Doanh thu tổng hợp theo tháng
  async getMonthlyRevenue(filter: FilterRevenueDto) {
    const currentYear = new Date().getFullYear();
    const selectedYear = filter.year || currentYear;
    const selectedType = filter.type || 'total';

    let query = '';
    const params: any[] = [selectedYear];

    if (selectedType === 'total') {
      query = `
        SELECT
          DATE_FORMAT(o.paid_at, '%Y-%m') AS month,
          DATE_FORMAT(o.paid_at, '%m') AS month_num,
          DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
          COALESCE(SUM(o.total_price), 0) AS total
        FROM orders o
        WHERE o.status = 'PAID' AND DATE_FORMAT(o.paid_at, '%Y') = ?
        GROUP BY DATE_FORMAT(o.paid_at, '%Y-%m'), DATE_FORMAT(o.paid_at, '%m'), DATE_FORMAT(o.paid_at, '%m/%Y')
        ORDER BY month_num ASC
      `;
    } else if (selectedType === 'gate') {
      query = `
        SELECT
          DATE_FORMAT(o.paid_at, '%Y-%m') AS month,
          DATE_FORMAT(o.paid_at, '%m') AS month_num,
          DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
          COALESCE(SUM(oi.price), 0) AS total
        FROM tickets t
        JOIN order_items oi ON t.order_item_id = oi.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'PAID'
          AND t.status != 'CANCELLED'
          AND DATE_FORMAT(o.paid_at, '%Y') = ?
        GROUP BY DATE_FORMAT(o.paid_at, '%Y-%m'), DATE_FORMAT(o.paid_at, '%m'), DATE_FORMAT(o.paid_at, '%m/%Y')
        ORDER BY month_num ASC
      `;
    }

    const result = await this.dataSource.query(query, params);

    // Điền dữ liệu cho tất cả 12 tháng
    const monthlyData: Record<string, number> = {};
    for (let month = 1; month <= 12; month++) {
      const monthNum = month.toString().padStart(2, '0');
      const monthDisplay = `${monthNum}/${selectedYear}`;
      monthlyData[monthDisplay] = 0;
    }

    // Điền dữ liệu từ kết quả truy vấn
    result.forEach((row: any) => {
      if (monthlyData.hasOwnProperty(row.month_display)) {
        monthlyData[row.month_display] = parseFloat(row.total);
      }
    });

    return {
      year: selectedYear,
      type: selectedType,
      data: monthlyData,
    };
  }

  // Doanh thu chi tiết theo loại vé cổng
  async getGateTicketDetails() {
    const result = await this.dataSource.query(`
      SELECT
        gt.id,
        gt.name,
        gt.price,
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

  // Doanh thu chi tiết theo game (trả về rỗng vì game không còn bán riêng)
  async getGameTicketDetails() {
    return [];
  }

  // Thống kê tổng quan
  async getOverview() {
    const result = await this.dataSource.query(`
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
}
