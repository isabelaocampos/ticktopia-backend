import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Presentation } from "src/presentation/entities/presentation.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Ticket ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    buyDate: Date;

    @Column({ type: 'boolean' })
    isRedeemed: boolean;

    @Column({ type: 'boolean' })
    isActive: boolean;

    @ManyToOne(
        () => User,
        (user) => user.tickets,
        { cascade: true, eager: true, nullable: false }
    )
    user: User;

    
    @ManyToOne(
        () => Presentation,
        (presentation ) => presentation.tickets,
        { cascade: true, eager: true, nullable: false }
    )
    presentation: Presentation;


}
