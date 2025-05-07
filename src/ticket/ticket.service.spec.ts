import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';

const mockTicketRepository = {
  find: jest.fn(),
  save: jest.fn(),
};

const mockUserRepository = {
  find: jest.fn(),
  save: jest.fn(),
};


const mockPresentationRepository = {
  find: jest.fn(),
  save: jest.fn(),
};


describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: 'TicketRepository',
          useValue: mockTicketRepository,
        },
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'PresentationRepository',
          useValue: mockPresentationRepository,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
