import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Presentation } from 'src/presentation/entities/presentation.entity';
import { Repository } from 'typeorm';

import { Ticket } from 'src/ticket/entities/ticket.entity';
import { BuyTicketDto } from 'src/ticket/dto/buy-ticket.dto';

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
  let ticketRepo: Repository<Ticket>;
  let userRepo: Repository<User>;
  let presentationRepo: Repository<Presentation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Presentation),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    ticketRepo = module.get(getRepositoryToken(Ticket));
    userRepo = module.get(getRepositoryToken(User));
    presentationRepo = module.get(getRepositoryToken(Presentation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if user or presentation not found', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    const dto: BuyTicketDto = {
        presentationId: 'abc',
        quantity: 1,
        userId: ''
    };

    await expect(service.buyTicket('userId', dto)).rejects.toThrow();
  });

  it('should create a ticket if data is valid and space is available', async () => {
    const user = { id: 'userId' } as User;
    const presentation = {
      idPresentation: 'abc',
      capacity: 100,
      tickets: [],
    } as unknown as Presentation;

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(presentation);
    jest.spyOn(ticketRepo, 'count').mockResolvedValue(0);
    jest.spyOn(ticketRepo, 'findOne').mockResolvedValue(null);
    jest.spyOn(ticketRepo, 'create').mockReturnValue({} as Ticket);
    jest.spyOn(ticketRepo, 'save').mockResolvedValue({ id: '123' } as Ticket);

    const dto: BuyTicketDto = {
        presentationId: 'abc',
        quantity: 1,
        userId: ''
    };

    const result = await service.buyTicket('userId', dto);
    expect(result).toEqual({ id: '123' });
  });
});
