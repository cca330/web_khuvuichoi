import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventImage } from './entities/event-image.entity';
import { EventSchedule } from './entities/event-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventImage, EventSchedule]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
