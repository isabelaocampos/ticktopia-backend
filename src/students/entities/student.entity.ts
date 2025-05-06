import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
  } from "typeorm";
  import { Grade } from "./grade.entity";
  import { Event } from "../../event/entities/event.entity";
  import { ApiProperty } from "@nestjs/swagger";
  import { Ticket } from "src/tickets/entities/ticket.entity";

  @Entity()
  export class Student {
    @ApiProperty({
      example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
      description: 'Student ID',
      uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty()
    @Column('text')
    name: string;
  
    @ApiProperty({ nullable: true })
    @Column({ type: 'int', nullable: true })
    age: number;
  
    @ApiProperty()
    @Column({ type: 'text', unique: true })
    email: string;
  
    @ApiProperty()
    @Column({ type: 'text', array: true })
    subjects: string[];
  
    @ApiProperty()
    @Column('text')
    gender: string;
  
    @ApiProperty()
    @Column('text', { unique: true, nullable: true })
    nickname?: string;
  
    @OneToMany(() => Grade, grade => grade.student, { cascade: true, eager: true })
    grades?: Grade[];
  
    @OneToMany(() => Event, event => event.user)
    events: Event[];
  
    @BeforeInsert()
    checkNicknameInsert() {
      if (!this.nickname) {
        this.nickname = this.name;
      }
      this.nickname = this.nickname.toLowerCase().replaceAll(" ", "_") + this.age;
    }
  
    @BeforeUpdate()
    checkNickNameUpdate() {
      this.nickname = this.nickname!.toLowerCase().replaceAll(" ", "_") + this.age;
    }
    @OneToMany(() => Ticket, ticket => ticket.event)
    tickets: Ticket[];




}
