import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApplyPromotionOrderDto {
  @IsNotEmpty()
  @IsNumber()
  promotionId: number;

  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  discountAmount: number;
}