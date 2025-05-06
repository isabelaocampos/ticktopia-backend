import { ApiProperty } from "@nestjs/swagger";
import { Event } from "src/event/entities/event.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Presentation {

    @PrimaryGeneratedColumn('uuid')
    idPresentation: string;

    @ApiProperty({
        example: 'Atanasio Giradot',
        description: 'Name of the place where event is placed',
    })
    @Column('text')
    place: string;


    @ManyToOne(() => Event, event => event.presentations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'Event_idevent' })
    event: Event;


    @ApiProperty({
        description: 'Capacity of this presentation',
        example: 500
    })

    @Column({ type: 'int' })
    capacity: number;


    @Column({ type: 'timestamp' })
    openDate: Date;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'float' })
    latitude: number;

    @Column({ type: 'float' })
    longitude: number;

    @Column('text')
    description: string;

    @Column({ type: 'timestamp' })
    ticketAvailabilityDate: Date;

    @Column({ type: 'timestamp' })
    ticketSaleAvailabilityDate: Date;

    @Column('text')
    city: string;

    @OneToMany(() => Ticket, (ticket) => ticket.presentation)
    tickets: Ticket[];

}




