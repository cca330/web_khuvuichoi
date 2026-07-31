import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PromotionStatus } from '../entities/promotion.entity';

export class CreatePromotionDto {
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;

  @IsNumber({}, { message: 'Discount phải là số' })
  discount: number;

  @IsDateString({}, { message: 'Start date phải là ngày hợp lệ' })
  startDate: string;

  @IsDateString({}, { message: 'End date phải là ngày hợp lệ' })
  endDate: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(PromotionStatus, { message: 'Status phải là ACTIVE hoặc EXPIRED' })
  status?: PromotionStatus;

  @IsOptional()
  @IsArray({ message: 'Gate ticket IDs phải là mảng' })
  gateTicketIds?: number[];
}
