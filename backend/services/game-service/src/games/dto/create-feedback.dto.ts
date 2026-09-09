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
  rating!: number;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung đánh giá không được để trống' })
  @Max(5)
  @MaxLength(1000, { message: 'Nội dung đánh giá tối đa 1000 ký tự' })
  content!: string;
}
