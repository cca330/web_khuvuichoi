import { Controller, Get, Post, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { GenerateTicketsDto } from './dto/generate-tickets.dto';
import { FilterRevenueDto } from './dto/filter-revenue.dto';
import { CalculateBaseTotalDto } from './dto/calculate-base-total.dto';
import { ApplyPromotionOrderDto } from './dto/apply-promotion-order.dto';
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('internal/promotion/:promotionId/total-used')
getPromotionTotalUsed(@Param('promotionId') promotionId: string) {
  return this.ticketsService.getPromotionTotalUsed(parseInt(promotionId));
}

@Get('internal/promotion/:promotionId/total-discount')
getPromotionTotalDiscount(@Param('promotionId') promotionId: string) {
  return this.ticketsService.getPromotionTotalDiscount(parseInt(promotionId));
}

@Get('internal/gate-tickets')
getActiveGateTickets() {
  return this.ticketsService.getActiveGateTickets();
}

@Post('internal/calculate-base-total')
@HttpCode(HttpStatus.OK)
calculateBaseTotal(@Body() dto: CalculateBaseTotalDto) {
  return this.ticketsService.calculateBaseTotal(dto);
}

@Post('internal/apply-promotion-order')
@HttpCode(HttpStatus.OK)
applyPromotionOrder(@Body() dto: ApplyPromotionOrderDto) {
  return this.ticketsService.applyPromotionToOrder(dto);
}
  @Get()
  findAll(@Query() filter: FilterTicketsDto) {
    return this.ticketsService.findAll(filter);
  }

  @Get('stats')
  getStats() {
    return this.ticketsService.getStats();
  }

  @Get('order/:orderId')
  getTicketsByOrder(@Param('orderId') orderId: string) {
    return this.ticketsService.getTicketsByOrder(parseInt(orderId));
  }

  @Post('scan')
  @HttpCode(HttpStatus.OK)
  scanTicket(@Body() dto: ScanTicketDto) {
    return this.ticketsService.scanTicket(dto);
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  generateTickets(@Body() dto: GenerateTicketsDto) {
    return this.ticketsService.generateByOrder(dto.orderId);
  }
  

// ===== API nội bộ, chỉ dành cho revenue-service gọi sang =====
@Get('internal/revenue/years')
getRevenueYears() {
  return this.ticketsService.getAvailableYears();
}

@Get('internal/revenue/monthly')
getRevenueMonthly(@Query() filter: FilterRevenueDto) {
  return this.ticketsService.getMonthlyRevenue(filter);
}

@Get('internal/revenue/gate-details')
getRevenueGateDetails() {
  return this.ticketsService.getGateTicketDetails();
}

@Get('internal/revenue/overview')
getRevenueOverview() {
  return this.ticketsService.getOverview();
}
}
