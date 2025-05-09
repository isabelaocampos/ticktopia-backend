import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { PresentationService } from '../presentation/presentation.service';
import { AuthService } from '../auth/auth.service';

describe('TicketController', () => {
  let controller: TicketController;

  const mockTicketService = {
    findAll: jest.fn(() => ['ticket1', 'ticket2']), // ejemplo de método mock
  };
  const mockPresentationService = {
    findAll: jest.fn(() => ['ticket1', 'ticket2']), // ejemplo de método mock
  };

  const mockAuthService = {
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
        {
          provide: PresentationService,
          useValue: mockPresentationService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
