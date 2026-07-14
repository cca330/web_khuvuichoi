import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EventImage } from './event-image.entity';
import { EventSchedule } from './event-schedule.entity';

export enum EventStatus {
  COMING_SOON = 'COMING_SOON',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

 @Column()
thumbnail: string; 

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'start_datetime', type: 'datetime' })
  startDatetime: Date;

  @Column({ name: 'end_datetime', type: 'datetime' })
  endDatetime: Date;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.COMING_SOON,
  })
  status: EventStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // Relations
  @OneToMany('EventImage', 'event')
  images: EventImage[];

  @OneToMany('EventSchedule', 'event')
  schedules: EventSchedule[];
}
