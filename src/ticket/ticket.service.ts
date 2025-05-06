import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from 'src/auth/entities/user.entity';
import { Presentation } from 'src/presentation/entities/presentation.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Presentation) private presentationRepo: Repository<Presentation>,
  ) {}

  async create(dto: CreateTicketDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    const presentation = await this.presentationRepo.findOne({ where: { idPresentation: dto.presentationId } });

    if (!user || !presentation) {
      throw new NotFoundException('User or Presentation not found');
    }

    const ticket = this.ticketRepo.create({
      buyDate: new Date(),
      isRedeemed: dto.isRedeemed,
      isActive: dto.isActive,
      user,
      presentation,
    });

    return this.ticketRepo.save(ticket);
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

  async remove(id: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.ticketRepo.remove(ticket);
  }
}
