import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonsModule } from './commons/commons.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { TicketService } from './ticket/ticket.service';
import { TicketController } from './ticket/ticket.controller';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { EventModule } from './event/event.module';
import { PresentationModule } from './presentation/presentation.module';
import { TicketModule } from './ticket/ticket.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? "switchback.proxy.rlwy.net",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 21766,
      database: process.env.DB_NAME ?? "railway",
      username: process.env.DB_USERNAME ?? "postgres",
      password: process.env.DB_PASSWORD ?? "ZngwhXtfDJSCYmJAHCKhUkZzBTRMUrce",
      autoLoadEntities: true,
      synchronize: true //Solo usarla en ambientes bajos, en producción hacer migraciones
    }),
    CommonsModule,
    SeedModule,
    AuthModule,
    EventModule,
    PresentationModule,
    TicketModule
  ]

})
export class AppModule {}
