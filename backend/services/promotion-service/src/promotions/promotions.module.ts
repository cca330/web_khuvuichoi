import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { Promotion } from './entities/promotion.entity';
import { PromotionGateTicket } from './entities/promotion-gate-ticket.entity';
import { AuthModule } from '../auth/auth.module';
import { InternalServiceGuard } from '../auth/guards/internal-service.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, PromotionGateTicket]),
    HttpModule,
    ConfigModule,
    AuthModule,
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService, InternalServiceGuard],
  exports: [PromotionsService],
})
export class PromotionsModule {}
