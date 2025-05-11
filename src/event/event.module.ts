import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
  imports: [PassportModule.register({ defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([Event, User]),
    AuthModule
  ]
})
export class EventModule {}
