import { IsNotEmpty, IsOptional } from 'class-validator';

export class ScanTicketDto {
  @IsNotEmpty({ message: 'Ticket code không được để trống' })
  ticketCode: string;

  @IsOptional()
  gateName?: string;

  @IsOptional()
  staffId?: number;
}
