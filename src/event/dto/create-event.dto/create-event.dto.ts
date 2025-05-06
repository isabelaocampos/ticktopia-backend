import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateEventDto {
  @ApiProperty({
    description: 'Name of the event',
    example: 'Tech Conference 2025',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL to the banner image of the event',
    example: 'https://example.com/images/banner.jpg',
  })
  @IsString()
  bannerPhotoUrl: string;

  @ApiProperty({
    description: 'Whether the event is public or private',
    example: true,
  })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    description: 'UUID of the user creating the event',
    example: 'c2f2f8d4-2a1b-4e8a-83c4-f5f5f5f5f5f5',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Total number of tickets available for the event',
    example: 100,
  })
  @IsNumber()
  @Min(1)
  totalTickets: number;
}

