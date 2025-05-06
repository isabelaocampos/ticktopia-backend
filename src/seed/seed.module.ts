import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { StudentsModule } from '../students/students.module';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [StudentsModule, EventModule],
})
export class SeedModule {}
