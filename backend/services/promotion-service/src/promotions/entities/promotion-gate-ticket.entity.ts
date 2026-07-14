import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Promotion } from './promotion.entity';

@Entity('promotion_gate_tickets')
export class PromotionGateTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'promotion_id' })
  promotionId: number;

  @Column({ name: 'gate_ticket_id' })
  gateTicketId: number;

  // Relations
  @ManyToOne('Promotion', 'gateTickets')
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;
}
