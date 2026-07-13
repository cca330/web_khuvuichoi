import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { TicketScan } from './entities/ticket-scan.entity';
import { GateTicket } from './entities/gate-ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketScan, GateTicket]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
