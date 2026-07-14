import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string;

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

  // Relations
  @OneToMany('GameImage', 'game')
  images: GameImage[];
}