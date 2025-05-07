import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
  imports: [TypeOrmModule.forFeature([Event, User]),
  ]
})
export class EventModule { }
