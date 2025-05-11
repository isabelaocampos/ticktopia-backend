import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CancelTicketDto {
  @ApiProperty({
    example: 'Cambio de planes',
    description: 'Reason for cancelling the ticket',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
