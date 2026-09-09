import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung đánh giá không được để trống' })
  @MaxLength(1000, { message: 'Nội dung đánh giá tối đa 1000 ký tự' })
  content!: string;
}
