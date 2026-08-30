import { IsNotEmpty, IsOptional, IsNumber, Matches } from 'class-validator';

export class CreateEventScheduleDto {
  @IsNotEmpty({ message: 'Event ID không được để trống' })
  eventId: number;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'Schedule time phải đúng định dạng HH:mm:ss',
  })
  scheduleTime: string;

  @IsNotEmpty({ message: 'Title không được để trống' })
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Sort order phải là số' })
  sortOrder?: number;
}
