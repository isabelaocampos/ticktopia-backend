import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, EventModule]
})
export class SeedModule {}
