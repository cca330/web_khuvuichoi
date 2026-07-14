import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Thiếu reset token' })
  resetToken: string;

  @MinLength(6)
  newPassword: string;
}
