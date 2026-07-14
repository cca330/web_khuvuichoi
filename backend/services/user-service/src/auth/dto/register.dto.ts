import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string;

  @MinLength(6, { message: 'Password phải từ 6 ký tự' })
  password: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}
