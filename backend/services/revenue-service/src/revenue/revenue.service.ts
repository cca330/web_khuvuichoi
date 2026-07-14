import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FilterRevenueDto } from './dto/filter-revenue.dto';

@Injectable()
export class RevenueService {
  private readonly ticketServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ticketServiceUrl = this.configService.get<string>('TICKET_SERVICE_URL') as string;
  }

  private async callTicketService(path: string, params?: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.ticketServiceUrl}${path}`, { params }),
      );
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Không gọi được ticket-service: ${error.message}`,
      );
    }
  }

  async getAvailableYears() {
    return this.callTicketService('/tickets/internal/revenue/years');
  }

  async getMonthlyRevenue(filter: FilterRevenueDto) {
    return this.callTicketService('/tickets/internal/revenue/monthly', filter);
  }

  async getGateTicketDetails() {
    return this.callTicketService('/tickets/internal/revenue/gate-details');
  }

  async getGameTicketDetails() {
    return []; // giữ nguyên như cũ, không có dữ liệu game bán riêng
  }

  async getOverview() {
    return this.callTicketService('/tickets/internal/revenue/overview');
  }
}