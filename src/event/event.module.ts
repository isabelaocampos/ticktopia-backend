import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from '../auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
  imports: [PassportModule.register({ defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([Event, User]),
    AuthModule
  ]
})
export class EventModule { }
