import { IsNotEmpty, IsNumber, IsDateString, IsArray, IsEnum } from 'class-validator';
import { PromotionStatus } from '../entities/promotion.entity';

export class UpdatePromotionDto {
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;

  @IsNumber({}, { message: 'Discount phải là số' })
  discount: number;

  @IsDateString({}, { message: 'Start date phải là ngày hợp lệ' })
  startDate: string;

  @IsDateString({}, { message: 'End date phải là ngày hợp lệ' })
  endDate: string;

  @IsEnum(PromotionStatus, { message: 'Status phải là ACTIVE hoặc EXPIRED' })
  status: PromotionStatus;

  @IsArray({ message: 'Gate ticket IDs phải là mảng' })
  gateTicketIds: number[];
}
