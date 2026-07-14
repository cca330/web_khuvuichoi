import { IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateEventScheduleDto {
  @IsDateString({}, { message: 'Schedule time phải là ngày hợp lệ' })
  scheduleTime: string;

  @IsNotEmpty({ message: 'Title không được để trống' })
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Sort order phải là số' })
  sortOrder?: number;
}
