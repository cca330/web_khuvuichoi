import { IsNotEmpty, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { AllowedTicket, GameStatus } from '../entities/game.entity';

export class CreateGameDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Recommended age phải là số' })
  recommendedAge?: number;

  @IsEnum(AllowedTicket, { message: 'Allowed ticket phải là ALL, ADULT hoặc CHILD' })
  allowedTicket: AllowedTicket;

  @IsEnum(GameStatus, { message: 'Status phải là OPEN hoặc CLOSE' })
  status: GameStatus;

  @IsOptional()
  @IsArray({ message: 'Images phải là mảng' })
  images?: string[];
}
