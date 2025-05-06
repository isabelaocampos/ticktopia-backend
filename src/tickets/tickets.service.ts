import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Ticket } from './entities/ticket.entity';
  import { BuyTicketDto } from './dto/buy-ticket.dto';
  import { CancelTicketDto } from './dto/cancel-ticket.dto';
  //import { User } from 'src/users/entities/user.entity';
  //import { Event } from 'src/events/entities/event.entity';
  
  @Injectable()
  export class TicketsService {
    constructor(
      @InjectRepository(Ticket)
      private ticketRepository: Repository<Ticket>,
  
      @InjectRepository(Event)
      private eventRepository: Repository<Event>,
  
      //@InjectRepository(User)
      //private userRepository: Repository<User>,
    ) {}
  
    // 1. Comprar un boleto
    async buyTicket(userId: number, dto: BuyTicketDto) {
      const event = await this.eventRepository.findOne({ where: { id: dto.eventId } });
  
      if (!event) {
        throw new NotFoundException('Evento no encontrado');
      }
  
      if (event.availableTickets < dto.quantity) {
        throw new BadRequestException('No hay suficientes boletos disponibles');
      }
  
      // Simulación de pago (puedes expandirla según el método de pago)
      const paymentSuccess = this.simulatePayment(dto.paymentMethod);
      if (!paymentSuccess) {
        throw new BadRequestException('Error en el pago simulado');
      }
  
      event.availableTickets -= dto.quantity;
      await this.eventRepository.save(event);
  
      const user = await this.userRepository.findOne({ where: { id: userId } });
  
      const ticket = this.ticketRepository.create({
        user,
        event,
        quantity: dto.quantity,
        paymentMethod: dto.paymentMethod,
        status: 'paid',
      });
  
      return this.ticketRepository.save(ticket);
    }
  
    // 2. Ver boletos del usuario
    async getTicketsByUser(userId: number) {
      return this.ticketRepository.find({
        where: { user: { id: userId } },
        relations: ['event'],
      });
    }
  
    // 3. Ver detalles de un boleto
    async getTicketById(ticketId: number, userId: number) {
      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId },
        relations: ['event', 'user'],
      });
  
      if (!ticket) {
        throw new NotFoundException('Ticket no encontrado');
      }
  
      if (ticket.user.id !== userId) {
        throw new ForbiddenException('No tienes acceso a este ticket');
      }
  
      return ticket;
    }
  
    // 4. Cancelar un boleto
    async cancelTicket(ticketId: number, userId: number, dto: CancelTicketDto) {
      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId },
        relations: ['user', 'event'],
      });
  
      if (!ticket) {
        throw new NotFoundException('Ticket no encontrado');
      }
  
      if (ticket.user.id !== userId) {
        throw new ForbiddenException('No puedes cancelar este boleto');
      }
  
      if (ticket.status === 'cancelled') {
        throw new BadRequestException('Este boleto ya fue cancelado');
      }
  
      ticket.status = 'cancelled';
      // ticket.reason = dto.reason; // Solo si agregaste esta propiedad en la entidad
  
      // Opcional: devolver el ticket al evento
      ticket.event.availableTickets += ticket.quantity;
      await this.eventRepository.save(ticket.event);
  
      return this.ticketRepository.save(ticket);
    }
  
    // 🔁 Simulación de pago
    simulatePayment(method: string): boolean {
      const allowedMethods = ['card', 'paypal', 'pse'];
      return allowedMethods.includes(method);
    }
  }
  