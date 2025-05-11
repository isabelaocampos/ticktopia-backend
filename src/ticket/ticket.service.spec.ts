import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from '../../src/ticket/ticket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from '../../src/ticket/entities/ticket.entity';
import { User } from '../../src/auth/entities/user.entity';
import { Presentation } from '../../src/presentation/entities/presentation.entity';
import { Repository } from 'typeorm';
import { BuyTicketDto } from '../../src/ticket/dto/buy-ticket.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Presentation),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    ticketRepo = module.get(getRepositoryToken(Ticket));
    userRepo = module.get(getRepositoryToken(User));
    presentationRepo = module.get(getRepositoryToken(Presentation));
  });

  it('should buy a ticket successfully', async () => {
    const user = { id: 'user-1' } as User;
    const presentation = { idPresentation: 'pres-1', capacity: 100 } as Presentation;
    const dto: BuyTicketDto = {
      presentationId: 'pres-1', quantity: 2,
      userId: ''
    };

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(presentation);
    jest.spyOn(ticketRepo, 'count').mockResolvedValue(10);
    jest.spyOn(ticketRepo, 'create').mockReturnValue({} as Ticket);
    jest.spyOn(ticketRepo, 'save').mockResolvedValue({ id: 'ticket-1' } as Ticket);

    const result = await service.buyTicket(user.id, dto);
    expect(result).toEqual({ id: 'ticket-1' });
  });

  it('should throw if presentation not found', async () => {
    const dto: BuyTicketDto = {
      presentationId: 'x', quantity: 1,
      userId: ''
    };

    jest.spyOn(userRepo, 'findOne').mockResolvedValue({} as User);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(null);

    await expect(service.buyTicket('user', dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw if not enough tickets', async () => {
    const user = { id: 'user-1' } as User;
    const presentation = { idPresentation: 'pres-1', capacity: 5 } as Presentation;
    const dto: BuyTicketDto = {
      presentationId: 'pres-1', quantity: 10,
      userId: ''
    };

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(presentation);
    jest.spyOn(ticketRepo, 'count').mockResolvedValue(0);

    await expect(service.buyTicket(user.id, dto)).rejects.toThrow(BadRequestException);
  });
});
