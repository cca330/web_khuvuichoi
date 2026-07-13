import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GameImage } from './game-image.entity';

export enum GameStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export enum AllowedTicket {
  ALL = 'ALL',
  ADULT = 'ADULT',
  CHILD = 'CHILD',
}

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'recommended_age', type: 'int', nullable: true })
  recommendedAge: number;

  @Column({
    name: 'allowed_ticket',
    type: 'enum',
    enum: AllowedTicket,
    default: AllowedTicket.ALL,
  })
  allowedTicket: AllowedTicket;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.OPEN,
  })
  status: GameStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // Relations
  @OneToMany('GameImage', 'game')
  images: GameImage[];
}
