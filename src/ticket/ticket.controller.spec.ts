import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../auth/entities/user.entity';
import { Presentation } from '../presentation/entities/presentation.entity';

describe('TicketController', () => {
  let controller: TicketController;

  const mockTicketService = {
    findAll: jest.fn(() => ['ticket1', 'ticket2']), // ejemplo de método mock
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
