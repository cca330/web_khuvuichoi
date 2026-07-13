import { IsNotEmpty, IsNumber } from 'class-validator';

export class GenerateTicketsDto {
  @IsNotEmpty({ message: 'Order ID không được để trống' })
  @IsNumber({}, { message: 'Order ID phải là số' })
  orderId: number;
}
