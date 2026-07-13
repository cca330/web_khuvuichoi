import { IsNotEmpty, IsOptional, IsDateString, IsEnum, IsArray } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto {
  @IsNotEmpty({ message: 'Title không được để trống' })
  title: string;

  @IsOptional()
  thumbnail?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  location?: string;

  @IsDateString({}, { message: 'Start datetime phải là ngày hợp lệ' })
  startDatetime: string;

  @IsDateString({}, { message: 'End datetime phải là ngày hợp lệ' })
  endDatetime: string;

  @IsEnum(EventStatus, { message: 'Status phải là COMING_SOON, ONGOING, COMPLETED hoặc CANCELLED' })
  status: EventStatus;

  @IsOptional()
  @IsArray({ message: 'Images phải là mảng' })
  images?: string[];
}
