// ticket.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../entities/user.entity';
//import { Event } from 'src/events/entities/event.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @ManyToOne(() => Event, (event) => event.tickets)
  event: Event;

  @Column({ default: 1 })
  quantity: number;

  @Column()
  paymentMethod: string;

  @Column({ default: 'paid' })
  status: 'paid' | 'cancelled' | 'failed';

  @CreateDateColumn()
  purchaseDate: Date;

  @Column({ nullable: true })
  transactionId?: string; // para simular un ID de pago
}
