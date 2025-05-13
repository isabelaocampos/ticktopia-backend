import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateEventDto } from './dto/update-event.dto';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/user-role/user-role.guard';

jest.mock('@nestjs/passport', () => {
  return {
    ...jest.requireActual('@nestjs/passport'),
    AuthGuard: jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    })),
  };
});

jest.mock('../auth/guards/user-role/user-role.guard', () => {
  return {
    UserRoleGuard: jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    })),
  };
});

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), // Importar PassportModule
      ],
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt')) // Sobreescribir el AuthGuard
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(UserRoleGuard) // Sobreescribir el UserRoleGuard
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<EventController>(EventController);
  });

  const mockEventService = {
    // Mock del método create con un ejemplo de respuesta
    create: jest.fn((dto) => ({
      ...dto,  // Simula la creación de un evento
      id: 'new-event-id',
    })),
    findAll: jest.fn((limit, offset) => ['evento1', 'evento2']), // Mock del método findAll
    findAllByUserId: jest.fn((userId) => ['evento1']), // Mock del método findAllByUserId
    findOne: jest.fn((searchTerm, user) => 'evento1'), // Mock del método findOne
    remove: jest.fn((eventId, user) => 'Deleted Event'), // Mock del método remove
    update: jest.fn((eventId, dto, user) => 'Updated Event'), // Mock del método update
  };

  const mockUser = {
    id: 'user-id',
    roles: [ValidRoles.admin], // Ajustar según el rol
    email: 'user@example.com',
    name: 'Test User',
    lastname: 'User Lastname',
    isActive: true,
    password: 'password123',
    events: [],
    tickets: [],
    checkFieldsBeforeInsert: jest.fn(), // Mock implementation
    checkFieldsBeforeUpdate: jest.fn(), // Mock implementation
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

  it('should create an event', async () => {
    const createEventDto: CreateEventDto = {
      name: 'My Awesome Event',
      bannerPhotoUrl: 'https://example.com/banner.jpg',
      isPublic: true,
    };

    const result = await controller.create(createEventDto, mockUser as User);

    // Verificar que el evento se haya creado correctamente
    expect(result).toEqual({
      ...createEventDto,
      id: 'new-event-id', // El evento debería tener un id generado
      userId: mockUser.id,

    });
    expect(mockEventService.create).toHaveBeenCalledWith({
      ...createEventDto,
      userId: mockUser.id,
    });
  });

  it('should fail when the event data is invalid', () => {
    const createEventDto: CreateEventDto = {
      name: '',  // Nombre vacío, lo que debería invalidar el DTO
      bannerPhotoUrl: '',
      isPublic: true,
    };

    // Simular que el servicio lanza una excepción para datos inválidos
    mockEventService.create.mockImplementationOnce(() => {
      throw new Error('Event name cannot be empty');
    });

    // Usar toThrow() en lugar de rejects.toThrow() porque el método no es async
    expect(() => controller.create(createEventDto, mockUser as User)).toThrow();
  });

  it('should create an event', async () => {
    const createEventDto: CreateEventDto = {
      name: 'My Awesome Event',
      bannerPhotoUrl: 'https://example.com/banner.jpg',
      isPublic: true,
    };

    const result = await controller.create(createEventDto, mockUser as User);
    expect(result).toEqual({
      ...createEventDto,
      id: 'new-event-id',
      userId: mockUser.id,


    });
    expect(mockEventService.create).toHaveBeenCalledWith({
      ...createEventDto,
      userId: mockUser.id,
    });
  });

  it('should return a list of events with pagination', async () => {
    const result = await controller.findAll('10', '0'); // Paginación con límite y desplazamiento
    expect(result).toEqual(['evento1', 'evento2']);
    expect(mockEventService.findAll).toHaveBeenCalledWith(10, 0);
  });

  it('should return events for a specific user', async () => {
    const result = await controller.findAllByUserId('user-id-123');
    expect(result).toEqual(['evento1']);
    expect(mockEventService.findAllByUserId).toHaveBeenCalledWith('user-id-123');
  });

  it('should return a single event by search term', async () => {
    const result = await controller.findOne('event-term', mockUser);
    expect(result).toEqual('evento1');
    expect(mockEventService.findOne).toHaveBeenCalledWith('event-term', mockUser);
  });

  it('should delete an event', async () => {
    const result = await controller.remove('event-id-123', mockUser);
    expect(result).toEqual('Deleted Event');
    expect(mockEventService.remove).toHaveBeenCalledWith('event-id-123', mockUser);
  });

  it('should update an event', async () => {
    const updateEventDto: UpdateEventDto = { name: 'Updated Event' };
    const result = await controller.update('event-id-123', updateEventDto, mockUser);
    expect(result).toEqual('Updated Event');
    expect(mockEventService.update).toHaveBeenCalledWith('event-id-123', updateEventDto, mockUser);
  });


});

describe('EventController - deleteAll', () => {
  let controller: EventController;

  const mockEventService = {
    deleteAll: jest.fn(),
  };

  const mockAdminUser: User = {
    id: 'admin-id',
    roles: [ValidRoles.admin],
    email: 'admin@example.com',
    name: 'Admin User',
    lastname: 'Admin Lastname',
    isActive: true,
    password: 'securepass',
    events: [],
    tickets: [],
    checkFieldsBeforeInsert: jest.fn(),
    checkFieldsBeforeUpdate: jest.fn(),
  };

  const mockNonAdminUser: User = {
    ...mockAdminUser,
    id: 'user-id',
    roles: [],
    email: 'user@example.com',
    checkFieldsBeforeInsert: function (): void {
      throw new Error('Function not implemented.');
    },
    checkFieldsBeforeUpdate: function (): void {
      throw new Error('Function not implemented.');
    }
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

  it('should delete all events when called by an admin', async () => {
    const responseMock = { message: 'All events deleted' };
    mockEventService.deleteAll.mockResolvedValue(responseMock);

    const result = await controller.deleteAll();
    expect(result).toEqual(responseMock);
    expect(mockEventService.deleteAll).toHaveBeenCalled();
  });

  it('should throw BadRequestException if service fails', async () => {
    mockEventService.deleteAll.mockImplementation(() => {
      throw new BadRequestException('Something went wrong');
    });

    expect(() => controller.deleteAll()).toThrow(BadRequestException);
  });
});

describe('EventController - findAll', () => {
  let controller: EventController;

  const mockEventService = {
    findAll: jest.fn(),
  };

  const mockAdminUser: User = {
    id: 'admin-id',
    roles: [ValidRoles.admin],
    email: 'admin@example.com',
    name: 'Admin User',
    lastname: 'Admin Lastname',
    isActive: true,
    password: 'securepass',
    events: [],
    tickets: [],
    checkFieldsBeforeInsert: jest.fn(),
    checkFieldsBeforeUpdate: jest.fn(),
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

  it('should return a list of events with default pagination', async () => {
    const mockEvents = ['event1', 'event2'];
    mockEventService.findAll.mockResolvedValue(mockEvents);

    const result = await controller.findAll('10', '0');
    expect(result).toEqual(mockEvents);
    expect(mockEventService.findAll).toHaveBeenCalledWith(10, 0); // valores por defecto
  });

  it('should return a list of events with provided limit and offset', async () => {
    const mockEvents = ['event1', 'event2', 'event3'];
    mockEventService.findAll.mockResolvedValue(mockEvents);

    const result = await controller.findAll('5', '15');
    expect(result).toEqual(mockEvents);
    expect(mockEventService.findAll).toHaveBeenCalledWith(5, 15);
  });

  it('should handle invalid limit and offset values', async () => {
    const mockEvents = ['event1'];
    mockEventService.findAll.mockResolvedValue(mockEvents);

    const result = await controller.findAll('invalid', 'wrong');
    expect(result).toEqual(mockEvents);
    expect(mockEventService.findAll).toHaveBeenCalledWith(10, 0); // defaults si parseInt falla
  });

  it('should throw BadRequestException if service fails', async () => {
    mockEventService.findAll.mockImplementation(() => {
      throw new BadRequestException('Something went wrong');
    });

    expect(() => controller.findAll('10', '0')).toThrow(BadRequestException);
  });
});