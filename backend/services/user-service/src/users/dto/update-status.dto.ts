import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(UserStatus, { message: 'status phải là ACTIVE hoặc BLOCK' })
  status: UserStatus;
}
