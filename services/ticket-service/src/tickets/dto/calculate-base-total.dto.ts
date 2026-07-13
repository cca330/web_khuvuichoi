import { IsNotEmpty, IsNumber } from 'class-validator';

export class CalculateBaseTotalDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  promotionId: number;
}