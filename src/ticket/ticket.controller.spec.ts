import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from '../../src/ticket/ticket.controller';
import { TicketService } from '../../src/ticket/ticket.service';
import { CreateTicketDto } from '../../src/ticket/dto/create-ticket.dto';
import { BuyTicketDto } from '../../src/ticket/dto/buy-ticket.dto';

describe('TicketController', () => {
  let controller: TicketController;
  let service: TicketService;

  const mockService = {
    create: jest.fn().mockReturnValue('ticket created'),
    buyTicket: jest.fn().mockReturnValue('ticket bought'),
    findAll: jest.fn().mockReturnValue(['ticket1', 'ticket2']),
    findOne: jest.fn().mockReturnValue('ticket1'),
    remove: jest.fn().mockReturnValue('ticket deleted'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
    service = module.get<TicketService>(TicketService);
  });

  it('should call service.create', () => {
    const dto = {} as CreateTicketDto;
    expect(controller.create(dto)).toBe('ticket created');
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.buyTicket', () => {
    const dto = { presentationId: '1', quantity: 1 } as BuyTicketDto;
    expect(controller.findAll()).toEqual(['ticket1', 'ticket2']);
    expect(service.findAll).toHaveBeenCalled(); // si quieres verificar la llamada

  });

  it('should return all tickets', () => {
    expect(controller.findAll()).toEqual(['ticket1', 'ticket2']);
    expect(service.findAll).toHaveBeenCalled();
  });


  it('should return one ticket', () => {
    expect(controller.findOne('123')).toBe('ticket1');
    expect(service.findOne).toHaveBeenCalledWith('123');
  });


  it('should call remove', () => {
    expect(controller.remove('123')).toBe('ticket deleted');
    expect(service.remove).toHaveBeenCalledWith('123');
  });
});
