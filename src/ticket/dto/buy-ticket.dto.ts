import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class BuyTicketDto {
  @ApiProperty({
    description: 'UUID of the presentation',
    example: '8c9a1d12-aaaa-4bbf-ccdd-eeeeeeeeeeee',
  })
  @IsUUID()
  presentationId: string;

  @ApiProperty({
    description: 'Quantity of tickets to buy',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'UUID of the user making the purchase',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;
}

