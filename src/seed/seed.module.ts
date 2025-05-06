import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [EventModule]
})
export class SeedModule {}
