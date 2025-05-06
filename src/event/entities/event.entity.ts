import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import { Student } from "../../students/entities/student.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  idEvent: number;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({ type: 'varchar', length: 255 }) // más realista para URLs largas
  bannerPhotoUrl: string;

  @Column({ type: 'tinyint' })
  isPublic: boolean;

  @Column({ type: 'int' })
  totalTickets: number;

  @Column({ type: 'int' })
  availableTickets: number;

  @ManyToOne(() => Student, user => user.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'User_idUser' })
  user: Student;

  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[];
}
