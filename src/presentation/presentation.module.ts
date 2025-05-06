import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presentation } from './entities/presentation.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  controllers: [PresentationController],
  providers: [PresentationService],
  imports: [TypeOrmModule.forFeature([Presentation, Event]),
  ]
})
export class PresentationModule { }
