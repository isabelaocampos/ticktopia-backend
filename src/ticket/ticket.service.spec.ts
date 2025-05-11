import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from '../../src/ticket/ticket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from '../../src/ticket/entities/ticket.entity';
import { User } from '../../src/auth/entities/user.entity';
import { Presentation } from '../../src/presentation/entities/presentation.entity';
import { Repository } from 'typeorm';
import { BuyTicketDto } from '../../src/ticket/dto/buy-ticket.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTicketDto } from '../../src/ticket/dto/create-ticket.dto';

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
            findOne: jest.fn(),
            delete: jest.fn(),
            remove: jest.fn(),
            preload: jest.fn(),
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

  it('should create a ticket successfully', async () => {
    const dto = {
      userId: 'u1',
      presentationId: 'p1',
      isActive: true,
      isRedeemed: false,
    } as CreateTicketDto;

    const user = { id: 'u1' } as User;
    const presentation = { idPresentation: 'p1' } as Presentation;

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(presentation);
    jest.spyOn(ticketRepo, 'create').mockReturnValue({} as Ticket);
    jest.spyOn(ticketRepo, 'save').mockResolvedValue({ id: 't1' } as Ticket);

    const result = await service.create(dto);
    expect(result).toEqual({ id: 't1' });
  });

  it('should throw if user or presentation not found', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(null);

    const dto = {
      userId: 'u1',
      presentationId: 'p1',
      isActive: true,
      isRedeemed: false,
    } as CreateTicketDto;

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should buy a ticket successfully', async () => {
    const dto: BuyTicketDto = {
      presentationId: 'p1',
      quantity: 2,
      userId: ''
    };

    const user = { id: 'u1' } as User;
    const presentation = { idPresentation: 'p1', capacity: 100 } as Presentation;

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(presentation);
    jest.spyOn(ticketRepo, 'count').mockResolvedValue(10);
    jest.spyOn(ticketRepo, 'create').mockReturnValue({} as Ticket);
    jest.spyOn(ticketRepo, 'save').mockResolvedValue({ id: 't1' } as Ticket);

    const result = await service.buyTicket(user.id, dto);
    expect(result).toEqual({ id: 't1' });
  });

  it('should throw if presentation not found in buyTicket', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue({} as User);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(null);

    const dto: BuyTicketDto = {
      presentationId: 'x',
      quantity: 1,
      userId: ''
    };

    await expect(service.buyTicket('u1', dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw if not enough tickets in buyTicket', async () => {
    const user = { id: 'u1' } as User;
    const presentation = { idPresentation: 'p1', capacity: 3 } as Presentation;
    const dto: BuyTicketDto = {
      presentationId: 'p1',
      quantity: 5,
      userId: ''
    };

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(presentationRepo, 'findOne').mockResolvedValue(presentation);
    jest.spyOn(ticketRepo, 'count').mockResolvedValue(2); // ya vendidos 2

    await expect(service.buyTicket('u1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should remove a ticket by id', async () => {
    const ticket = { id: 't1' } as Ticket;

    jest.spyOn(ticketRepo, 'findOne').mockResolvedValue(ticket);
    jest.spyOn(ticketRepo, 'remove').mockResolvedValue(ticket);

    const result = await service.remove('t1');
    expect(result).toEqual(ticket);
  });

  it('should throw NotFoundException if ticket not found in remove', async () => {
    jest.spyOn(ticketRepo, 'findOne').mockResolvedValue(null);

    await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
  });
});
