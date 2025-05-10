import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from '../auth/entities/user.entity';
import { Presentation } from '../presentation/entities/presentation.entity';
import axios from 'axios';
import * as qs from 'qs';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { CancelTicketDto } from './dto/cancel-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Presentation) private presentationRepo: Repository<Presentation>,
  ) { }

  async create(dto: CreateTicketDto & { isRedeemed?: boolean, isActive?: boolean }) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    const presentation = await this.presentationRepo.findOne({ where: { idPresentation: dto.presentationId } });

    if (!user || !presentation) {
      throw new NotFoundException('User or Presentation not found');
    }

    const ticket = this.ticketRepo.create({
      buyDate: new Date(),
      isRedeemed: dto.isRedeemed ?? false,
      isActive: dto.isActive ?? false,
      user,
      presentation,
    });

    return this.ticketRepo.save(ticket);
  }

  async createCheckoutSession(quantity: number, user: User, presentation: Presentation) {
    const ticket = this.ticketRepo.create({
      buyDate: new Date(),
      isRedeemed: false,
      isActive: false,
      user,
      presentation,
    });
    const ticketData = await this.ticketRepo.save(ticket);

    const data = {
      'line_items[0][quantity]': quantity,
      'line_items[0][price_data][currency]': 'cop',
      'line_items[0][price_data][product_data][name]': presentation.event.name,
      'line_items[0][price_data][unit_amount]': presentation.price * quantity * 100,
      'payment_method_types[0]': 'card',
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/success?ticketId=${ticketData.id}`,
      cancel_url: `${process.env.BASE_URL}/failure`,
      'metadata[userId]': user.id,
      'metadata[ticketId]': ticket.id,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    };

    try {
      const response: {data: {url: string}} = await axios.post(
        'https://api.stripe.com/v1/checkout/sessions',
        qs.stringify(data),
        { headers },
      );
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session', error);
      throw error;
    }
  }

  findAll() {
    return this.ticketRepo.find();
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto) {
    const ticket = await this.ticketRepo.preload({ id, ...dto });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.ticketRepo.save(ticket);
  }


  async deleteAll() {
    await this.ticketRepo.delete({});
  }

  async remove(id: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.ticketRepo.remove(ticket);
  }
  async buyTicket(userId: string, buyDto: BuyTicketDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const presentation = await this.presentationRepo.findOne({
      where: { idPresentation: buyDto.presentationId },
    });
  
    if (!user || !presentation) {
      throw new NotFoundException('User or Presentation not found');
    }
  
    const sold = await this.ticketRepo.count({
      where: {
        presentation: { idPresentation: presentation.idPresentation },
        isActive: true,
      },
    });
  
    if (sold + buyDto.quantity > presentation.capacity) {
      throw new BadRequestException('Not enough tickets available');
    }
  
    const ticket = this.ticketRepo.create({
      user,
      presentation,
      buyDate: new Date(),
      isActive: true,
      isRedeemed: false,
      quantity: buyDto.quantity,
    });
  
    return this.ticketRepo.save(ticket);
  }
}
