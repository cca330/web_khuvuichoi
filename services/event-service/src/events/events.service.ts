import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { EventImage } from './entities/event-image.entity';
import { EventSchedule } from './entities/event-schedule.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventScheduleDto } from './dto/create-event-schedule.dto';
import { UpdateEventScheduleDto } from './dto/update-event-schedule.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventImage)
    private readonly eventImageRepository: Repository<EventImage>,
    @InjectRepository(EventSchedule)
    private readonly eventScheduleRepository: Repository<EventSchedule>,
  ) {}

  // Lấy tất cả events
  async findAll() {
    return this.eventRepository.find({
      relations: ['images', 'schedules'],
      order: { startDatetime: 'DESC' },
    });
  }

  // Lấy event theo id
  async findById(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['images', 'schedules'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  // Tạo event mới
  async create(dto: CreateEventDto) {
    const queryRunner = this.eventRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const event = queryRunner.manager.create(Event, {
        title: dto.title,
        thumbnail: dto.thumbnail,
        description: dto.description,
        location: dto.location,
        startDatetime: new Date(dto.startDatetime),
        endDatetime: new Date(dto.endDatetime),
        status: dto.status,
      });

      const savedEvent = await queryRunner.manager.save(Event, event);

      // Add images if provided
      if (dto.images && dto.images.length > 0) {
        for (const image of dto.images) {
          const eventImage = queryRunner.manager.create(EventImage, {
            eventId: savedEvent.id,
            image,
          });
          await queryRunner.manager.save(EventImage, eventImage);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(savedEvent.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Cập nhật event
  async update(id: number, dto: UpdateEventDto) {
    const queryRunner = this.eventRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const event = await queryRunner.manager.findOne(Event, {
        where: { id },
      });
      if (!event) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('Event not found');
      }

      event.title = dto.title;
      if (dto.thumbnail !== undefined) event.thumbnail = dto.thumbnail;
      if (dto.description !== undefined) event.description = dto.description;
      if (dto.location !== undefined) event.location = dto.location;
      event.startDatetime = new Date(dto.startDatetime);
      event.endDatetime = new Date(dto.endDatetime);
      event.status = dto.status;

      await queryRunner.manager.save(Event, event);

      // Replace images if provided
      if (dto.images && dto.images.length > 0) {
        // Delete old images
        await queryRunner.manager.delete(EventImage, { eventId: id });

        // Add new images
        for (const image of dto.images) {
          const eventImage = queryRunner.manager.create(EventImage, {
            eventId: id,
            image,
          });
          await queryRunner.manager.save(EventImage, eventImage);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Xóa event
  async delete(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Get image filenames for deletion
    const imageFiles = event.images.map((img) => img.image);

    await this.eventRepository.delete(id);

    return { deleted: true, imageFiles };
  }

  // --- Event Schedule Methods ---

  // Lấy schedules theo event_id
  async getSchedulesByEventId(eventId: number) {
    return this.eventScheduleRepository.find({
      where: { eventId },
      order: { sortOrder: 'ASC' },
    });
  }

  // Tạo schedule mới
  async createSchedule(dto: CreateEventScheduleDto) {
    const schedule = this.eventScheduleRepository.create({
      eventId: dto.eventId,
      scheduleTime: new Date(dto.scheduleTime),
      title: dto.title,
      description: dto.description,
      sortOrder: dto.sortOrder || 1,
    });
    return this.eventScheduleRepository.save(schedule);
  }

  // Cập nhật schedule
  async updateSchedule(id: number, dto: UpdateEventScheduleDto) {
    const schedule = await this.eventScheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException('Event schedule not found');
    }

    schedule.scheduleTime = new Date(dto.scheduleTime);
    schedule.title = dto.title;
    if (dto.description !== undefined) schedule.description = dto.description;
    if (dto.sortOrder !== undefined) schedule.sortOrder = dto.sortOrder;

    return this.eventScheduleRepository.save(schedule);
  }

  // Xóa schedule
  async deleteSchedule(id: number) {
    const schedule = await this.eventScheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException('Event schedule not found');
    }

    await this.eventScheduleRepository.delete(id);
    return { deleted: true };
  }
}
