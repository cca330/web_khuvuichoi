import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

export enum ScanType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('ticket_scans')
export class TicketScan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ticket_id' })
  ticketId: number;

  @Column({
    type: 'enum',
    enum: ScanType,
  })
  scanType: ScanType;

  @CreateDateColumn({ name: 'scanned_at', type: 'datetime' })
  scannedAt: Date;

  @Column({ name: 'gate_name', type: 'varchar', length: 100, nullable: true })
  gateName: string;

  @Column({ name: 'staff_id', type: 'int', nullable: true })
  staffId: number;

  // Relations
  @ManyToOne('Ticket', 'scans')
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;
}
