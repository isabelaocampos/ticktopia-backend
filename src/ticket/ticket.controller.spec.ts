import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from '../../src/ticket/ticket.controller';
import { TicketService } from '../../src/ticket/ticket.service';
import { AuthService } from '../../src/auth/auth.service';
import { PresentationService } from '../../src/presentation/presentation.service';

describe('TicketController', () => {
  let controller: TicketController;
  let service: TicketService;

  const mockTicketService = {
    create: jest.fn().mockReturnValue('ticket created'),
    buyTicket: jest.fn().mockReturnValue('ticket bought'),
    findAll: jest.fn().mockReturnValue(['ticket1', 'ticket2']),
    findOne: jest.fn().mockReturnValue('ticket1'),
    remove: jest.fn().mockReturnValue('ticket deleted'),
  };

  const mockAuthService = {
    findById: jest.fn().mockReturnValue({ id: 'user1' }),
  };

  const mockPresentationService = {
    findOne: jest.fn().mockReturnValue({ idPresentation: 'pres1', capacity: 100 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        { provide: TicketService, useValue: mockTicketService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PresentationService, useValue: mockPresentationService },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
    service = module.get<TicketService>(TicketService);
  });

  it('should call service.create', async () => {
    await expect(controller.create({} as any)).resolves.toBe('ticket created');
  });


  it('should call service.buyTicket', async () => {
    const dto = { presentationId: '1', quantity: 1, userId: 'user1' };
    await expect(controller.buyTicket(dto)).resolves.toBe('ticket bought');
    expect(service.buyTicket).toHaveBeenCalledWith('user1', dto);
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
