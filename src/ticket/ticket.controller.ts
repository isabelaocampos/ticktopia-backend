import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { CancelTicketDto } from './dto/cancel-ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('admin')
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Post('buy')
  buyTicket(@Req() req, @Body() dto: BuyTicketDto) {
    return this.ticketService.buyTicket(req.user.id, dto);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Patch(':id/cancel')
  cancelTicket(
  @Param('id') id: string,
  @Body() dto: CancelTicketDto,
  @Req() req
  ) {
  return this.ticketService.cancelTicket(id, req.user.id, dto);
  }

}
