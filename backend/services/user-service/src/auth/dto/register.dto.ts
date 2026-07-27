import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username không được để trống' })
  @MinLength(3, { message: 'Username phải từ 3 ký tự' })
  @MaxLength(50, { message: 'Username không quá 50 ký tự' })
  // Không cho phép ký tự đặc biệt có thể dùng cho XSS
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới' })
  username: string;

  @MinLength(6, { message: 'Password phải từ 6 ký tự' })
  @MaxLength(100, { message: 'Password không quá 100 ký tự' })
  password: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100, { message: 'Email không quá 100 ký tự' })
  email: string;
}
