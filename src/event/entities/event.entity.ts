import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Presentation } from "src/presentation/entities/presentation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Event ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text')
    name: string;

    @Column('text')
    bannerPhotoUrl: string;

    @Column({ type: 'boolean' })
    isPublic: boolean;

    @OneToMany(() => Presentation, (presentation) => presentation.event)
    presentations: Presentation[];

    @ManyToOne(
        () => User,
        (user) => user.events,
        { cascade: true, eager: true, nullable: false }
    )
    user: User;

}
