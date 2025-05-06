import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, IsUUID } from "class-validator";

export class CreateEventDto {
  @ApiProperty({
    description: 'Name of the event',
    example: 'Hackathon 2025'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL to the banner image of the event',
    example: 'https://example.com/banner.jpg'
  })
  @IsString()
  bannerPhotoUrl: string;

  @ApiProperty({
    description: 'Whether the event is public or private',
    example: true
  })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    description: 'UUID of the student creating the event',
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8'
  })
  @IsUUID()
  userId: string;
}
