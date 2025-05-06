import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelTicketDto {
  @ApiPropertyOptional({
    example: 'Cambio de planes',
    description: 'Motivo opcional de la cancelación del ticket',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
