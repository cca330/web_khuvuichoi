import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import { CircuitBreaker } from '../common/circuit-breaker';
import { getTraceId } from '../common/trace-context';
import { FilterRevenueDto } from './dto/filter-revenue.dto';

@Injectable()
export class RevenueService {
  private readonly ticketServiceCircuit = new CircuitBreaker();
  private readonly ticketServiceUrl: string;
  private readonly internalServiceToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ticketServiceUrl = this.configService.get<string>(
      'TICKET_SERVICE_URL',
    ) as string;
    this.internalServiceToken = this.configService.get<string>(
      'INTERNAL_SERVICE_TOKEN',
    ) as string;
  }

  private async callTicketService(path: string, params?: any) {
    try {
      const { data } = await this.ticketServiceCircuit.execute(() =>
        firstValueFrom(
          this.httpService
            .get(`${this.ticketServiceUrl}${path}`, {
              params,
              headers: {
                'x-internal-service-token': this.internalServiceToken,
                'x-trace-id': getTraceId() || 'system',
              },
            })
            .pipe(timeout(5000), retry({ count: 2, delay: 500 })),
        ),
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
