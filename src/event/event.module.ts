import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [EventController],
    providers: [EventService],
    imports: [
        TypeOrmModule.forFeature([Event]),
        AuthModule
    ],
    exports: [EventService]
})
export class EventModule {}
