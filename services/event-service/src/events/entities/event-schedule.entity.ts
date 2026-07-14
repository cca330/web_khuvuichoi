import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity('event_schedule')
export class EventSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'event_id' })
  eventId: number;

  @Column({ name: 'schedule_time', type: 'time' })
  scheduleTime: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'sort_order', type: 'int', default: 1 })
  sortOrder: number;

  // Relations
  @ManyToOne('Event', 'schedules')
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
