import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { BuyTicketDto } from './dto/buy-ticket.dto';

import { AuthService } from '../auth/auth.service';
import { PresentationService } from '../presentation/presentation.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly presentationService: PresentationService,
  ) {}

  @Post('admin')
  @ApiOperation({ summary: 'Create a ticket manually (admin)' })
  async create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Post('buy')
  @ApiOperation({ summary: 'Buy a ticket (simulated)' })
  async buyTicket(@Body() buyDto: BuyTicketDto) {
    const user = await this.authService.findById(buyDto.userId);
    const presentation = await this.presentationService.findOne(
      buyDto.presentationId,
    );

    if (!user || !presentation) {
      throw new InternalServerErrorException('User or Presentation not found');
    }

    return this.ticketService.buyTicket(user.id, buyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets (admin or dev)' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  update(@Param('id') id: string, @Body() updateDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateDto);
  }


  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete a ticket (dev)' })
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
