import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { BuyTicketDto } from './dto/buy-ticket.dto';


@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Post()
  buyTicket(@Req() req, @Body() dto: BuyTicketDto) {
    return this.ticketService.buyTicket(req.user.id, dto);
  }

  @Get()
  getMyTickets(@Req() req) {
    return this.ticketService.getTicketsByUser(req.user.id);
  }

  @Get(':id')
  getTicketDetails(@Param('id') id: number, @Req() req) {
    return this.ticketService.getTicketById(id, req.user.id);
  }

  @Put(':id/cancel')
  cancelTicket(@Param('id') id: number, @Req() req) {
    return this.ticketService.cancelTicket(id, req.user.id);
  }
}

