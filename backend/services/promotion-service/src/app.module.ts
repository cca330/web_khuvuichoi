import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    // Đọc file .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate Limiting với Throttler
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,   // 1 giây
        limit: 10,   // 10 requests/giây
      },
      {
        name: 'medium',
        ttl: 10000,  // 10 giây
        limit: 50,   // 50 requests/10 giây
      },
      {
        name: 'long',
        ttl: 60000,  // 1 phút
        limit: 200,  // 200 requests/phút
      },
    ]),

    // Kết nối MySQL qua TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),

    // Module quản lý promotions
    PromotionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
