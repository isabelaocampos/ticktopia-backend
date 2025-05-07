import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(private readonly userService: AuthService) { }


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

    return true;
  }

}
