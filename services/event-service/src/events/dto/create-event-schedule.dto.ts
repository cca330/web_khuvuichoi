import { IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateEventScheduleDto {
  @IsNotEmpty({ message: 'Event ID không được để trống' })
  eventId: number;

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
