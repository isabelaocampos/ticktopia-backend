import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PresentationService } from '../presentation/presentation.service';
import { AuthService } from '../auth/auth.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService, private readonly presentationService: PresentationService, private readonly userService: AuthService) { }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Post("checkout")
  async createCheckoutSession(@Body() createTicketDto: CreateCheckoutSessionDto) {
    const presentation = await this.presentationService.findOne(createTicketDto.presentationId);
    if (!presentation) {
      throw new InternalServerErrorException("Presentation not found")
    }

    const user = await this.userService.findById(createTicketDto.userId);
    if (!user) {
      throw new InternalServerErrorException("User not found")

    }
    const stripeData = await this.ticketService.createCheckoutSession(createTicketDto.quantity, user, presentation,)
    return stripeData.url;
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
