import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entity';
import { EventService } from '../event/event.service';
import { Event } from '../event/entities/event.entity';
import { Presentation } from '../presentation/entities/presentation.entity';
import { PresentationService } from '../presentation/presentation.service';
import { TicketService } from '../ticket/ticket.service';
import { Ticket } from '../ticket/entities/ticket.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class SeedService {

  constructor(private readonly userService: AuthService, private readonly eventService: EventService, private readonly presentationService: PresentationService, private readonly ticketService: TicketService) { }


  async runSeed() {

    const users = await this.insertNewUsers();
    const eventManagers = users.filter(result => result?.user.roles.includes(ValidRoles.eventManager))
    const eventManagerIds = eventManagers.map((eventManager) => eventManager!.user.id);
    const events = await this.insertNewEvents(eventManagerIds);
    console.log(events);
    const eventsIds = events.map((event) => event.id);
    const presentations = await this.insertNewPresentations(eventsIds);
    const presentationIds = presentations.map((presentation) => presentation.idPresentation);
    const clients = users.filter(result => result?.user.roles.includes(ValidRoles.client))
    const clientsIds = clients.map((client) => client!.user.id);
    await this.insertNewTickets(presentationIds, clientsIds);
    return 'SEED EXECUTED';
  }

  async insertNewUsers() {
    await this.ticketService.deleteAll();
    await this.presentationService.deleteAll();
    await this.eventService.deleteAll();
    await this.userService.deleteAllUsers();
    const users = initialData.users;
    const insertPromises: Promise<{ user: User, token: string } | undefined>[] = [];
    users.forEach(user => {
      insertPromises.push(this.userService.create(user))
    });
    return await Promise.all(insertPromises);;
  }

  async insertNewEvents(eventManagerIds: string[]) {
    await this.eventService.deleteAll();
    const events = initialData.events;
    const insertPromises: Promise<Event>[] = [];

    events.forEach(event => {
      const randomManagerId = eventManagerIds[Math.floor(Math.random() * eventManagerIds.length)];
      insertPromises.push(this.eventService.create({ ...event, userId: randomManagerId }));
    });

    return await Promise.all(insertPromises);
  }

  async insertNewPresentations(eventIds: string[]) {
    await this.presentationService.deleteAll();
    const presentations = initialData.presentations;
    const insertPromises: Promise<Presentation>[] = [];

    let eventIndex = 0;

    presentations.forEach(presentation => {
      const eventId = eventIds[eventIndex];
      console.log(eventId)
      insertPromises.push(this.presentationService.create({ ...presentation, eventId }));
      eventIndex = (eventIndex + 1) % eventIds.length;
    });

    return await Promise.all(insertPromises);
  }

  async insertNewTickets(presentationIds: string[], userIds: string[]) {
    await this.ticketService.deleteAll();
    const insertPromises: Promise<Ticket>[] = [];

    const combinations = [
      { isActive: false, isRedeemed: false },
      { isActive: false, isRedeemed: true },
      { isActive: true, isRedeemed: false },
      { isActive: true, isRedeemed: true }
    ];

    let comboIndex = 0;

    for (let i = 0; i < userIds.length && i * 2 < presentationIds.length * 2; i++) {
      const userId = userIds[i];

      const pres1 = presentationIds[(i * 2) % presentationIds.length];
      const pres2 = presentationIds[(i * 2 + 1) % presentationIds.length];

      insertPromises.push(this.ticketService.create({
        userId,
        presentationId: pres1,
        ...combinations[comboIndex % 4]
      }));

      comboIndex++;

      insertPromises.push(this.ticketService.create({
        userId,
        presentationId: pres2,
        ...combinations[comboIndex % 4]
      }));

      comboIndex++;
    }

    return await Promise.all(insertPromises);
  }


}
