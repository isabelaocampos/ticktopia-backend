import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class BuyTicketDto {
  @ApiProperty({ example: 1, description: 'ID del evento al que se comprará el ticket' })
  @IsNumber()
  eventId: number;

  @ApiProperty({ example: 2, description: 'Cantidad de boletos a comprar' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'paypal', description: 'Método de pago (card, paypal, pse)' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
