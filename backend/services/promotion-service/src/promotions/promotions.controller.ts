import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApplyPromotionDto } from './dto/apply-promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get('gate-tickets')
  getGateTickets() {
    return this.promotionsService.getAllGateTickets();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.promotionsService.findById(parseInt(id));
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return Promise.all([
      this.promotionsService.getTotalUsed(parseInt(id)),
      this.promotionsService.getTotalDiscount(parseInt(id)),
    ]).then(([totalUsed, totalDiscount]) => ({
      totalUsed,
      totalDiscount,
    }));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  apply(@Body() dto: ApplyPromotionDto) {
    return this.promotionsService.apply(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionsService.update(parseInt(id), dto);
  }

  @Delete(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  disable(@Param('id') id: string) {
    return this.promotionsService.disable(parseInt(id));
  }
}
