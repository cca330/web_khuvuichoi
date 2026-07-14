import { IsNotEmpty, IsNumber, IsDateString, IsArray, IsOptional } from 'class-validator';

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
  @IsArray({ message: 'Gate ticket IDs phải là mảng' })
  gateTicketIds?: number[];
}
