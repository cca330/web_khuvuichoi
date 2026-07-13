import { Controller, Get, Query } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { FilterRevenueDto } from './dto/filter-revenue.dto';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get('years')
  getAvailableYears() {
    return this.revenueService.getAvailableYears();
  }

  @Get('monthly')
  getMonthlyRevenue(@Query() filter: FilterRevenueDto) {
    return this.revenueService.getMonthlyRevenue(filter);
  }

  @Get('gate-details')
  getGateTicketDetails() {
    return this.revenueService.getGateTicketDetails();
  }

  @Get('game-details')
  getGameTicketDetails() {
    return this.revenueService.getGameTicketDetails();
  }

  @Get('overview')
  getOverview() {
    return this.revenueService.getOverview();
  }
}
