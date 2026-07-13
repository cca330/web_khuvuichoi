import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PromotionGateTicket } from './promotion-gate-ticket.entity';

export enum PromotionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'int' })
  discount: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: PromotionStatus,
    default: PromotionStatus.ACTIVE,
  })
  status: PromotionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // Relations
  @OneToMany('PromotionGateTicket', 'promotion')
  gateTickets: PromotionGateTicket[];
}
