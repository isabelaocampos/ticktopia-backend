import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presentation } from './entities/presentation.entity';
import { Event } from '../event/entities/event.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PresentationController],
  providers: [PresentationService],
  imports: [ AuthModule,TypeOrmModule.forFeature([Presentation, Event],),
  ],
  exports: [PresentationService]
})
export class PresentationModule { }
