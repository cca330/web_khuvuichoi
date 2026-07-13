import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { Promotion } from './entities/promotion.entity';
import { PromotionGateTicket } from './entities/promotion-gate-ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, PromotionGateTicket]),
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
