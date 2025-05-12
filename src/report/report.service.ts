import { Injectable } from '@nestjs/common';
import { TicketService } from '../ticket/ticket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../ticket/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Ticket) private ticketRepo: Repository<Ticket>) { }

  async generateSalesReport() {
    const ticketsPorEvento = await this.ticketRepo
      .createQueryBuilder('ticket')
      .innerJoin('ticket.presentation', 'presentation')
      .innerJoin('presentation.event', 'event')
      .select('event.id', 'eventId')
      .addSelect('event.name', 'eventName')
      .addSelect('COUNT(ticket.id)', 'totalTickets')
      .groupBy('event.id')
      .addGroupBy('event.name')
      .getRawMany();

    const ticketsPorVendedor = await this.ticketRepo
      .createQueryBuilder('ticket')
      .innerJoin('ticket.presentation', 'presentation')
      .innerJoin('presentation.event', 'event')
      .innerJoin('event.user', 'user')
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('user.lastname', 'userLastname')
      .addSelect('COUNT(ticket.id)', 'totalTickets')
      .groupBy('user.id')
      .addGroupBy('user.name')
      .addGroupBy('user.lastname')
      .getRawMany();


    return { ticketsPorVendedor, ticketsPorEvento };
  }


  async generateOcupationReport() {
    const resumenPorEvento = await this.ticketRepo
      .createQueryBuilder('ticket')
      .innerJoin('ticket.presentation', 'presentation')
      .innerJoin('presentation.event', 'event')
      .select('event.id', 'eventId')
      .addSelect('event.name', 'eventName')
      .addSelect('COUNT(ticket.id)', 'totalTickets')
      .addSelect('SUM(CASE WHEN ticket.isRedeemed = true THEN 1 ELSE 0 END)', 'redeemedTickets')
      .addSelect('SUM(CASE WHEN ticket.isActive = true THEN 1 ELSE 0 END)', 'activeTickets')
      .addSelect(`
    CASE 
      WHEN SUM(CASE WHEN ticket.isActive = true THEN 1 ELSE 0 END) = 0 
      THEN 0 
      ELSE 
        ROUND(SUM(CASE WHEN ticket.isRedeemed = true THEN 1 ELSE 0 END)::decimal / 
              NULLIF(SUM(CASE WHEN ticket.isActive = true THEN 1 ELSE 0 END), 0), 2)
    END
  `, 'redeemedToActiveRatio')
      .groupBy('event.id')
      .addGroupBy('event.name')
      .getRawMany();


    return resumenPorEvento;
  }
}
