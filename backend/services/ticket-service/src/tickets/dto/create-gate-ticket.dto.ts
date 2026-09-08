import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  GateTicketStatus,
  GateTicketType,
} from '../entities/gate-ticket.entity';

export class CreateGateTicketDto {
  @IsNotEmpty({ message: 'Tên loại vé không được để trống' })
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(GateTicketStatus)
  status!: GateTicketStatus;

  @IsEnum(GateTicketType)
  type!: GateTicketType;

  @IsInt()
  @Min(0)
  admitsAdult!: number;

  @IsInt()
  @Min(0)
  admitsChild!: number;

  @IsBoolean()
  isCombo!: boolean;

  @IsMilitaryTime()
  validFromTime!: string;

  @IsMilitaryTime()
  validUntilTime!: string;
}
