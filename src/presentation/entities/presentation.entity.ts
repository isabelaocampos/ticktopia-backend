import { ApiProperty } from "@nestjs/swagger";
import { Event } from "../../event/entities/event.entity";
import { Ticket } from "../../ticket/entities/ticket.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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


    @ManyToOne(
        () => Event,
        (event) => event.presentations,
        { cascade: true, eager: true, nullable: false }
    )
    event: Event;

    @ApiProperty({
        description: 'Capacity of this presentation',
        example: 500
    })

    @Column({ type: 'int' })
    capacity: number;

    @Column({ type: 'float' })
    price: number;

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



