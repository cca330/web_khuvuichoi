import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RevenueModule } from './revenue/revenue.module';

@Module({
  imports: [
    // Đọc file .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

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
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),

    // Module quản lý revenue
    RevenueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
