import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from './game.entity';

@Entity('game_images')
export class GameImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'game_id' })
  gameId: number;

  @Column()
  image: string;

  @Column({ name: 'sort_order', type: 'int', default: 1 })
  sortOrder: number;

  // Relations
  @ManyToOne('Game', 'images')
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
