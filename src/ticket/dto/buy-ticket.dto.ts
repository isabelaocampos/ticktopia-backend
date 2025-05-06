import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class BuyTicketDto {
  @ApiProperty({
    example: '8c9a1d12-aaaa-4bbf-ccdd-eeeeeeeeeeee',
    description: 'UUID of the presentation to buy a ticket for',
  })
  @IsUUID()
  presentationId: string;
}
