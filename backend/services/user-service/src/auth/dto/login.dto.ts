import { IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}
