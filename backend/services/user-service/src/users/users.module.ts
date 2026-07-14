import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // đăng ký entity User cho module này dùng
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // export để auth module dùng lại (check existsUsername, findOne...)
})
export class UsersModule {}
