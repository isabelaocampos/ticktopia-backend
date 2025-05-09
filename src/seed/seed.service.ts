import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { EventService } from 'src/event/event.service';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class SeedService {

  constructor(private readonly userService: AuthService, private readonly eventService: EventService) { }


  async runSeed() {
    const users = await this.insertNewUsers();
    const eventManagers = users.filter(result => result?.user.roles.includes('event-manager'))
    const eventManagerIds = eventManagers.map((eventManager) => eventManager!.user.id);
    await this.insertNewEvents(eventManagerIds);
    return 'SEED EXECUTED';
  }

  async insertNewUsers() {
    await this.userService.deleteAllUsers();
    const users = initialData.users;
    const insertPromises: Promise<{ user: User, token: string } | undefined>[] = [];
    users.forEach(user => {
      insertPromises.push(this.userService.create(user))
    });
    return await Promise.all(insertPromises); ;
  }

  async insertNewEvents(eventManagerIds: string[]) {
    await this.eventService.deleteAll();
    const events = initialData.events;
    const insertPromises: Promise<Event>[] = [];
  
    events.forEach(event => {
      const randomManagerId = eventManagerIds[Math.floor(Math.random() * eventManagerIds.length)];
      insertPromises.push(this.eventService.create({ ...event, userId: randomManagerId }));
    });
  
    await Promise.all(insertPromises);
  }
}

