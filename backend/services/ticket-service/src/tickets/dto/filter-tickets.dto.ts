import { IsEnum, IsOptional } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class FilterTicketsDto {
  @IsOptional()
  @IsEnum(TicketStatus, { message: 'status phải là ACTIVE, EXPIRED hoặc CANCELLED' })
  status?: TicketStatus;

  @IsOptional()
  type?: 'SINGLE' | 'COMBO';
}
