import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CancelTicketDto {
  @ApiProperty({
    example: 'Cambio de planes',
    description: 'Reason for cancelling the ticket',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    example: 'c8e1a401-9c4d-4d4a-9424-6f661fcbfddd',
    description: 'UUID of the user cancelling the ticket',
  })
  @IsUUID()
  userId: string;
}
