import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../auth/entities/user.entity";
import { Presentation } from "../../presentation/entities/presentation.entity";

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

  @ManyToOne(() => User, user => user.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'User_idUser' })
  user: User;

  @OneToMany(() => Ticket, ticket => ticket.event, { cascade: true })
  tickets: Ticket[];

  @OneToMany(() => Presentation, presentation => presentation.event)
  presentations: Presentation[];
}
