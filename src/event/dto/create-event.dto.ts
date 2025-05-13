import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateEventDto {
    @ApiProperty({
        example: 'My Awesome Event',
        description: 'Name of the event',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'https://example.com/banner.jpg',
        description: 'URL of the banner photo',
    })
    @IsString()
    @IsNotEmpty()
    bannerPhotoUrl: string;

    @ApiProperty({
        example: true,
        description: 'Indicates if the event is public',
        default: true
    })
    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean;

}
