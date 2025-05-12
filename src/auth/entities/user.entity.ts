import { Exclude } from "class-transformer";
import { Event } from "../../event/entities/event.entity";
import { Ticket } from "../../ticket/entities/ticket.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Exclude()
    @Column('text')
    password?: string;

    @Column('text')
    name: string;

    @Column('text')
    lastname: string;

    @Column('bool', { default: true })
    isActive: boolean;

    @OneToMany(() => Event, (event) => event.user)
    events: Event[];

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];


    @Column('text',{
        array: true,
        default: ['client']
    })
    roles: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
      this.email = this.email.toLowerCase().trim();
    }
  
    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
      this.checkFieldsBeforeInsert();
    }

    

    

}
