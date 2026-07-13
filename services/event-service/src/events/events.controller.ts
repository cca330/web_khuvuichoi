import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventScheduleDto } from './dto/create-event-schedule.dto';
import { UpdateEventScheduleDto } from './dto/update-event-schedule.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventsService.findById(parseInt(id));
  }

  @Get(':id/schedules')
  getSchedules(@Param('id') id: string) {
    return this.eventsService.getSchedulesByEventId(parseInt(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Post('schedules')
  @HttpCode(HttpStatus.CREATED)
  createSchedule(@Body() dto: CreateEventScheduleDto) {
    return this.eventsService.createSchedule(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(parseInt(id), dto);
  }

  @Put('schedules/:id')
  updateSchedule(@Param('id') id: string, @Body() dto: UpdateEventScheduleDto) {
    return this.eventsService.updateSchedule(parseInt(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.eventsService.delete(parseInt(id));
  }

  @Delete('schedules/:id')
  @HttpCode(HttpStatus.OK)
  deleteSchedule(@Param('id') id: string) {
    return this.eventsService.deleteSchedule(parseInt(id));
  }
}
