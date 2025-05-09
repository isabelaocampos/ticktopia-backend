import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { CancelTicketDto } from './dto/cancel-ticket.dto';
import { User } from '../auth/entities/user.entity';
import { Presentation } from '../presentation/entities/presentation.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Presentation)
    private presentationRepository: Repository<Presentation>
  ) {}

  async create(dto: CreateTicketDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    const presentation = await this.presentationRepository.findOne({ where: { idPresentation: dto.presentationId } });

    if (!user || !presentation) {
      throw new NotFoundException('User or Presentation not found');
    }

    const ticket = this.ticketRepository.create({
      buyDate: new Date(),
      isRedeemed: dto.isRedeemed,
      isActive: dto.isActive,
      user,
      presentation,
    });

    return this.ticketRepository.save(ticket);
  }

  findAll() {
    return this.ticketRepository.find();
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.preload({ id, ...dto });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.ticketRepository.save(ticket);
  }

  async remove(id: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.ticketRepository.remove(ticket);
  }

  async buyTicket(userId: string, dto: BuyTicketDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const presentation = await this.presentationRepository.findOne({
      where: { idPresentation: dto.presentationId },
      relations: ['tickets'], // Asegúrate que tengas esta relación en tu entidad
    });

    if (!user || !presentation) {
      throw new NotFoundException('User or Presentation not found');
    }

    // Revisa si quedan cupos
    const maxCapacity = presentation.capacity ?? 100; // ajusta según tu modelo
    const soldTickets = presentation.tickets?.filter(t => t.isActive).length ?? 0;

    if (soldTickets >= maxCapacity) {
      throw new BadRequestException('No more tickets available for this presentation');
    }

    // Verifica si el usuario ya tiene un ticket activo para esa presentación
    const existingTicket = await this.ticketRepository.findOne({
      where: {
        user: { id: userId },
        presentation: { idPresentation: dto.presentationId },
        isActive: true,
      },
    });

    if (existingTicket) {
      throw new BadRequestException('You already have an active ticket for this presentation');
    }

    const ticket = this.ticketRepository.create({
      buyDate: new Date(),
      isRedeemed: false,
      isActive: true,
      user,
      presentation,
    });

    return this.ticketRepository.save(ticket);
  }

  async cancelTicket(id: string, userId: string, dto: CancelTicketDto) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.user.id !== userId) {
      throw new ForbiddenException('You cannot cancel a ticket you do not own');
    }

    if (!ticket.isActive) {
      throw new BadRequestException('Ticket is already cancelled');
    }

    ticket.isActive = false;

    // (Opcional) Guardar motivo de cancelación en otro campo/log
    console.log(`Ticket ${id} cancelled. Reason: ${dto.reason}`);

    return this.ticketRepository.save(ticket);
  }
}
