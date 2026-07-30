import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameStatus, AllowedTicket } from './entities/game.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.gamesService.search(keyword || '');
  }

  @Get('gate/:type')
  getByGate(@Param('type') type: string) {
    const gateType = type.toUpperCase() as AllowedTicket;
    return this.gamesService.getByGate(gateType);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findById(id);
  }

  @Get(':id/stats')
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.getStats(id);
  }

  @Get(':id/feedbacks')
  getFeedbacks(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.getFeedbacks(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.delete(id);
  }

  @Put(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  close(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.close(id);
  }

  @Put(':id/open')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  open(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.open(id);
  }
}
