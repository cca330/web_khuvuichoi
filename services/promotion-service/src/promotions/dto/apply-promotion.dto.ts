import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApplyPromotionDto {
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;

  @IsNumber({}, { message: 'Order ID phải là số' })
  orderId: number;
}
