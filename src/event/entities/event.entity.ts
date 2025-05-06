import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Student } from "../../students/entities/student.entity";

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  idEvent: number;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({ type: 'varchar', length: 45 })
  bannerPhotoUrl: string;

  @Column({ type: 'tinyint' })
  isPublic: boolean;

  // 👉 Clave foránea explícita
  @Column('uuid')
  userId: string;

  // 👉 Relación con Student
  @ManyToOne(() => Student, student => student.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // usa el campo `userId` como FK
  user: Student;
}
