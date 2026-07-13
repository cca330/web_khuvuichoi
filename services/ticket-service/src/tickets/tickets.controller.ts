import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { GenerateTicketsDto } from './dto/generate-tickets.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@Query() filter: FilterTicketsDto) {
    return this.ticketsService.findAll(filter);
  }

  @Get('stats')
  getStats() {
    return this.ticketsService.getStats();
  }

  @Get('order/:orderId')
  getTicketsByOrder(@Query('orderId') orderId: string) {
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
}
