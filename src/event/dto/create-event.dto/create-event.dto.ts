import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEventDto {
  @ApiProperty({
    description: 'Name of the event',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL to the banner image of the event',
  })
  @IsString()
  bannerPhotoUrl: string;

  @ApiProperty({
    description: 'Whether the event is public or private',
  })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    description: 'UUID of the user creating the event',
  })
  @IsUUID()
  userId: string;
}
