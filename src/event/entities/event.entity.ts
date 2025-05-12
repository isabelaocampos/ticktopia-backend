import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import { Ticket } from "../../ticket/entities/ticket.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../auth/entities/user.entity";
import { Presentation } from "../../presentation/entities/presentation.entity";

@Entity()
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

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 255 }) // más realista para URLs largas
  bannerPhotoUrl: string;

  @ApiProperty()
  @Column({ type: 'boolean' })
  isPublic: boolean;

  @ManyToOne(() => User, user => user.events, { onDelete: 'CASCADE', cascade: true, eager: true, nullable: false })
  @JoinColumn({ name: 'User_idUser' })
  user: User;

  @OneToMany(() => Presentation, presentation => presentation.event)
  presentations: Presentation[];

  checkFieldsBeforeInsert() {
    if (this.name) this.name = this.name.trim();
    if (this.bannerPhotoUrl) this.bannerPhotoUrl = this.bannerPhotoUrl.trim().toLowerCase();
  }

  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

}
