import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePresentationDto {
    @ApiProperty({
        example: 'Atanasio Girardot',
        description: 'Name of the place where the presentation is held',
    })
    @IsString()
    @IsNotEmpty()
    place: string;

    @ApiProperty({
        example: 500,
        description: 'Capacity of this presentation',
    })
    @IsNumber()
    @IsNotEmpty()
    capacity: number;

    @ApiProperty({
        example: '2025-05-06T08:00:00Z',
        description: 'Date and time when doors open',
    })
    @IsDateString()
    @IsNotEmpty()
    openDate: Date;

    @ApiProperty({
        example: '2025-05-06T10:00:00Z',
        description: 'Date and time when the presentation starts',
    })
    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        example: 6.25184,
        description: 'Latitude of the presentation location',
    })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({
        example: -75.56359,
        description: 'Longitude of the presentation location',
    })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;

    @ApiProperty({
        example: 'A musical event in the main stadium.',
        description: 'Description of the presentation',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: '2025-04-20T00:00:00Z',
        description: 'Date when ticket availability starts',
    })
    @IsDateString()
    @IsNotEmpty()
    ticketAvailabilityDate: Date;

    @ApiProperty({
        example: '2025-04-25T00:00:00Z',
        description: 'Date when ticket sales become available',
    })
    @IsDateString()
    @IsNotEmpty()
    ticketSaleAvailabilityDate: Date;

    @ApiProperty({
        example: 'Medellín',
        description: 'City where the presentation is held',
    })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({
        description: 'Associated event for this presentation',
        example: '773701cb-ed1d-41fd-9921-7c56e0a6fcbd'
    })
    @IsString()
    @IsNotEmpty()
    eventId: string
}
