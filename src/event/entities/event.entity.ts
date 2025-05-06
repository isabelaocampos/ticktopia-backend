import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
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
  
    @ManyToOne(() => Student, user => user.events, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'User_idUser' })
    user: Student;
  
  }
  