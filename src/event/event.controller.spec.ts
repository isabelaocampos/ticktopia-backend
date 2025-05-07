import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';

describe('EventController', () => {
  let controller: EventController;

  const mockEventService = {
    // métodos que usa tu controller
    findAll: jest.fn(() => ['evento1', 'evento2']),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
