import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/entities/user.entity';

@Module({
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
  imports: [TypeOrmModule.forFeature([Event, User]),
  ]
})
export class EventModule {}
