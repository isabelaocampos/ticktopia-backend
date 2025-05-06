import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { CommonsModule } from './commons/commons.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { TicketsService } from './tickets/tickets.service';
import { TicketsController } from './tickets/tickets.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +!process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true //Solo usarla en ambientes bajos, en producción hacer migraciones
    }),
    StudentsModule,
    CommonsModule,
    SeedModule,
    AuthModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class AppModule {}
