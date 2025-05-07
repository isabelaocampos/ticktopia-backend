import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { EventService } from 'src/event/event.service';

@Injectable()
export class SeedService {

  constructor(private readonly eventService: EventService,
              private readonly userService: AuthService) { }


  async runSeed() {
    await this.insertNewUsers();
    return 'SEED EXECUTED';
  }

  async insertNewUsers() {
    await this.userService.deleteAllUsers;
    const users = initialData.users;
    const insertPromises: Promise<{ user: User, token: string } | undefined>[] = [];
    users.forEach(user => {
      insertPromises.push(this.userService.create(user))
    });
    await Promise.all(insertPromises);

//  return true;
//}

async insertNewEvents(){
  await this.eventService.deleteAllEvents();
  const events = initialData.events;
  const insertPromises: Promise<Event | undefined>[] = [];
  events.forEach(event => {
    insertPromises.push(this.eventService.create(event))
  });
  await Promise.all(insertPromises);
  return true;

}

}
}
