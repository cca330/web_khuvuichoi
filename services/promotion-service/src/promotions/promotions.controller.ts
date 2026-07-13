import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApplyPromotionDto } from './dto/apply-promotion.dto';

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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Post('apply')
  @HttpCode(HttpStatus.OK)
  apply(@Body() dto: ApplyPromotionDto) {
    return this.promotionsService.apply(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionsService.update(parseInt(id), dto);
  }

  @Delete(':id/disable')
  @HttpCode(HttpStatus.OK)
  disable(@Param('id') id: string) {
    return this.promotionsService.disable(parseInt(id));
  }
}
