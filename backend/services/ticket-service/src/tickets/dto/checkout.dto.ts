import { IsNotEmpty, IsNumber, Matches, Min } from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  orderId!: number;

  @IsNotEmpty({ message: 'Ngày sử dụng vé không được để trống' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày sử dụng vé phải có định dạng YYYY-MM-DD',
  })
  bookingDate!: string;
}