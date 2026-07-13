import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GameImage]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
