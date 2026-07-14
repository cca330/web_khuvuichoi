import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum GateTicketStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum GateTicketType {
  CHILD = 'CHILD',
  ADULT = 'ADULT',
  ALL = 'ALL',
}

@Entity('gate_tickets')
export class GateTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: GateTicketStatus,
    default: GateTicketStatus.ACTIVE,
  })
  status: GateTicketStatus;

  @Column({
    type: 'enum',
    enum: GateTicketType,
    default: GateTicketType.ALL,
  })
  type: GateTicketType;

  @Column({ name: 'admits_adult', type: 'int', default: 0 })
  admitsAdult: number;

  @Column({ name: 'admits_child', type: 'int', default: 0 })
  admitsChild: number;

  @Column({ name: 'is_combo', type: 'tinyint', default: 0 })
  isCombo: boolean;
}
