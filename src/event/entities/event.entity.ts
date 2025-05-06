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
import { ApiProperty } from "@nestjs/swagger";

@Entity('event')
export class Event {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'Event ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text')
  name: string;

  @ApiProperty({nullable: true})
  @Column({ type: 'varchar', length: 255 }) // más realista para URLs largas
  bannerPhotoUrl: string;

  @ApiProperty()
  @Column({ type: 'tinyint' })
  isPublic: boolean;

  @ApiProperty()
  @Column({ type: 'int' })
  totalTickets: number;

  @ApiProperty()
  @Column({ type: 'int' })
  availableTickets: number;

  @ManyToOne(() => Student, user => user.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'User_idUser' })
  user: Student;

  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[];
}
