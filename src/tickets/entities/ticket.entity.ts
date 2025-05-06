// ticket.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
//import { User } from '../entities/user.entity';
import { Student } from "../../students/entities/student.entity";
import { Event } from '../../event/entities/event.entity'; // Asegúrate de que la ruta sea correcta
@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.tickets)
  // user: User;

  // @ManyToOne(() => Event, (event) => event.tickets)
  // event: Event;

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

  @ManyToOne(() => Event, event => event.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Event_idEvent' })
  event: Event;

  @ManyToOne(() => Student, user => user.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'User_idUser' })
  user: Student;

}
