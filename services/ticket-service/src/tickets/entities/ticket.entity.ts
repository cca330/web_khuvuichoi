import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum TicketStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_item_id' })
  orderItemId: number;

  @Column({ name: 'gate_ticket_id' })
  gateTicketId: number;

  @Column({ name: 'ticket_code', unique: true })
  ticketCode: string;

  @Column({ name: 'admits_adult', type: 'int', default: 0 })
  admitsAdult: number;

  @Column({ name: 'admits_child', type: 'int', default: 0 })
  admitsChild: number;

  @Column({ name: 'valid_date', type: 'date' })
  validDate: Date;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status: TicketStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @ManyToOne('GateTicket', 'tickets')
  @JoinColumn({ name: 'gate_ticket_id' })
  gateTicket: any;
}
