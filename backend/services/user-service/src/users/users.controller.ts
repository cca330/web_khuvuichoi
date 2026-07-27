import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UserStatus } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Internal API - should be protected or removed from public gateway
  @Get('internal/by-ids')
  // @UseGuards(JwtAuthGuard) // Uncomment when proper internal network is set up
  findByIds(@Query('ids') ids: string) {
    const idArray = ids.split(',').map((id) => parseInt(id.trim()));
    return this.usersService.findByIds(idArray);
  }

  // Public - anyone can view list
  @Get()
  findAll(@Query('status') status?: UserStatus) {
    return this.usersService.findAll(status);
  }

  // Should require auth - but keeping public for now to not break functionality
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.usersService.updateStatus(id, dto.status);
  }
}
