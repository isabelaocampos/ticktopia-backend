import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { PresentationService } from '../presentation/presentation.service';
import { TicketService } from '../ticket/ticket.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Event } from '../event/entities/event.entity';
import { Presentation } from '../presentation/entities/presentation.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { CreateEventDto } from '../event/dto/create-event.dto';
import { CreatePresentationDto } from '../presentation/dto/create-presentation.dto';
import { CreateTicketDto } from '../ticket/dto/create-ticket.dto';

describe('SeedService', () => {
  let seedService: SeedService;
  let authService: AuthService;
  let eventService: EventService;
  let presentationService: PresentationService;
  let ticketService: TicketService;

  // Mock de los datos que retornarán los servicios
  const mockUsers = [
    { 
      user: { 
        id: '1', 
        email: 'manager1@test.com', 
        name: 'Manager',
        lastname: 'One',
        roles: [ValidRoles.eventManager] 
      }, 
      token: 'token1' 
    },
    { 
      user: { 
        id: '2', 
        email: 'manager2@test.com', 
        name: 'Manager',
        lastname: 'Two',
        roles: [ValidRoles.eventManager] 
      }, 
      token: 'token2' 
    },
    { 
      user: { 
        id: '3', 
        email: 'client1@test.com', 
        name: 'Client',
        lastname: 'One',
        roles: [ValidRoles.client] 
      }, 
      token: 'token3' 
    },
    { 
      user: { 
        id: '4', 
        email: 'client2@test.com', 
        name: 'Client',
        lastname: 'Two',
        roles: [ValidRoles.client] 
      }, 
      token: 'token4' 
    }
  ];

  const mockEvents = [
    { 
      id: 'event1', 
      name: 'Event 1', 
      bannerPhotoUrl: 'https://example.com/banner1.jpg', 
      isPublic: true,
      user: '1',
      presentations: [],
      
      
    },
    { 
      id: 'event2', 
      name: 'Event 2', 
      bannerPhotoUrl: 'https://example.com/banner2.jpg', 
      isPublic: false,
      user: '2',
      presentations: []
    }
  ];

  const mockPresentations = [
    { 
      idPresentation: 'pres1', 
      place: 'Venue 1',
      capacity: 1000,
      openDate: '2025-06-01T18:00:00Z',
      startDate: '2025-06-01T20:00:00Z',
      price: 50000,
      latitude: 6.25184,
      longitude: -75.56359,
      description: 'Amazing presentation 1',
      ticketAvailabilityDate: '2025-05-01T00:00:00Z',
      ticketSaleAvailabilityDate: '2025-05-10T00:00:00Z',
      city: 'Medellín',
      eventId: 'event1' 
    },
    { 
      idPresentation: 'pres2', 
      place: 'Venue 2',
      capacity: 2000,
      openDate: '2025-06-15T18:00:00Z',
      startDate: '2025-06-15T20:00:00Z',
      price: 75000,
      latitude: 4.71099,
      longitude: -74.07219,
      description: 'Amazing presentation 2',
      ticketAvailabilityDate: '2025-05-15T00:00:00Z',
      ticketSaleAvailabilityDate: '2025-05-20T00:00:00Z',
      city: 'Bogotá',
      eventId: 'event1' 
    },
    { 
      idPresentation: 'pres3', 
      place: 'Venue 3',
      capacity: 1500,
      openDate: '2025-07-01T18:00:00Z',
      startDate: '2025-07-01T20:00:00Z',
      price: 60000,
      latitude: 3.45126,
      longitude: -76.53220,
      description: 'Amazing presentation 3',
      ticketAvailabilityDate: '2025-06-01T00:00:00Z',
      ticketSaleAvailabilityDate: '2025-06-10T00:00:00Z',
      city: 'Cali',
      eventId: 'event2' 
    },
    { 
      idPresentation: 'pres4', 
      place: 'Venue 4',
      capacity: 3000,
      openDate: '2025-07-15T18:00:00Z',
      startDate: '2025-07-15T20:00:00Z',
      price: 100000,
      latitude: 10.96854,
      longitude: -74.78132,
      description: 'Amazing presentation 4',
      ticketAvailabilityDate: '2025-06-15T00:00:00Z',
      ticketSaleAvailabilityDate: '2025-06-20T00:00:00Z',
      city: 'Barranquilla',
      eventId: 'event2' 
    }
  ];

  const mockTickets = [
    { id: 'ticket1', userId: '3', presentationId: 'pres1', isActive: false, isRedeemed: false },
    { id: 'ticket2', userId: '3', presentationId: 'pres2', isActive: true, isRedeemed: false },
    { id: 'ticket3', userId: '4', presentationId: 'pres3', isActive: true, isRedeemed: true },
    { id: 'ticket4', userId: '4', presentationId: 'pres4', isActive: false, isRedeemed: false }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: AuthService,
          useValue: {
            create: jest.fn(),
            deleteAllUsers: jest.fn()
          }
        },
        {
          provide: EventService,
          useValue: {
            create: jest.fn(),
            deleteAll: jest.fn()
          }
        },
        {
          provide: PresentationService,
          useValue: {
            create: jest.fn(),
            deleteAll: jest.fn()
          }
        },
        {
          provide: TicketService,
          useValue: {
            create: jest.fn(),
            deleteAll: jest.fn()
          }
        }
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    authService = module.get<AuthService>(AuthService);
    eventService = module.get<EventService>(EventService);
    presentationService = module.get<PresentationService>(PresentationService);
    ticketService = module.get<TicketService>(TicketService);

    // Espiar console.log para evitar que ensucie la salida de pruebas
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seedService).toBeDefined();
  });

  describe('runSeed', () => {
    it('debería ejecutar el proceso completo de seed', async () => {
      // Configurar los mocks
      jest.spyOn(seedService, 'insertNewUsers').mockResolvedValue(mockUsers as any);
      jest.spyOn(seedService, 'insertNewEvents').mockResolvedValue(mockEvents as unknown as Event[]);
      jest.spyOn(seedService, 'insertNewPresentations').mockResolvedValue(mockPresentations as unknown as Presentation[]);
      jest.spyOn(seedService, 'insertNewTickets').mockResolvedValue(mockTickets as unknown as Ticket[]);

      // Ejecutar el método a probar
      const result = await seedService.runSeed();

      // Verificar que se llamaron todos los métodos necesarios
      expect(seedService.insertNewUsers).toHaveBeenCalled();
      expect(seedService.insertNewEvents).toHaveBeenCalledWith(['1', '2']);
      expect(seedService.insertNewPresentations).toHaveBeenCalledWith(['event1', 'event2']);
      expect(seedService.insertNewTickets).toHaveBeenCalledWith(
        ['pres1', 'pres2', 'pres3', 'pres4'], 
        ['3', '4']
      );

      // Verificar el resultado
      expect(result).toBe('SEED EXECUTED');
    });
  });

  describe('insertNewUsers', () => {
    it('debería eliminar datos existentes y crear nuevos usuarios', async () => {
      // Configurar los mocks para que coincidan con CreateAuthDto
      (authService.create as jest.Mock).mockImplementation((user: CreateAuthDto) => {
        if (user.email.includes('manager')) {
          return Promise.resolve({ 
            user: { 
              id: Math.random().toString(), 
              email: user.email,
              name: user.name,
              lastname: user.lastname,
              roles: [ValidRoles.eventManager] 
            }, 
            token: 'token' 
          });
        } else {
          return Promise.resolve({ 
            user: { 
              id: Math.random().toString(), 
              email: user.email,
              name: user.name,
              lastname: user.lastname,
              roles: [ValidRoles.client] 
            }, 
            token: 'token' 
          });
        }
      });

      // Ejecutar el método a probar
      const result = await seedService.insertNewUsers();

      // Verificar que se llamaron todos los métodos necesarios
      expect(ticketService.deleteAll).toHaveBeenCalled();
      expect(presentationService.deleteAll).toHaveBeenCalled();
      expect(eventService.deleteAll).toHaveBeenCalled();
      expect(authService.deleteAllUsers).toHaveBeenCalled();
      
      // Verificar que se creó cada usuario del initialData
      expect(authService.create).toHaveBeenCalledTimes(initialData.users.length);
      initialData.users.forEach(user => {
        expect(authService.create).toHaveBeenCalledWith(expect.objectContaining({
          email: user.email,
          password: user.password,
          name: user.name,
          lastname: user.lastname,
        } as CreateAuthDto));
      });

      // Verificar que el resultado tiene la estructura correcta
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(initialData.users.length);
      result.forEach(item => {
        expect(item).toHaveProperty('user');
        expect(item).toHaveProperty('token');
        expect(item?.user).toHaveProperty('id');
        expect(item?.user).toHaveProperty('email');
        expect(item?.user).toHaveProperty('name');
        expect(item?.user).toHaveProperty('lastname');
        expect(item?.user).toHaveProperty('roles');
      });
    });
  });

  describe('insertNewEvents', () => {
    it('debería crear nuevos eventos y asignarlos a managers aleatorios', async () => {
      // Configurar los mocks para que coincidan con CreateEventDto
      const eventManagerIds = ['1', '2'];
      (eventService.create as jest.Mock).mockImplementation((eventData: CreateEventDto & { userId: string }) => {
        return Promise.resolve({
          id: Math.random().toString(),
          name: eventData.name,
          bannerPhotoUrl: eventData.bannerPhotoUrl,
          isPublic: eventData.isPublic,
          userId: eventData.userId
        });
      });

      // Ejecutar el método a probar
      const result = await seedService.insertNewEvents(eventManagerIds);

      // Verificar que se llamaron todos los métodos necesarios
      expect(eventService.deleteAll).toHaveBeenCalled();
      
      // Verificar que se creó cada evento del initialData
      expect(eventService.create).toHaveBeenCalledTimes(initialData.events.length);
      
      // Verificar que cada evento se asignó a un manager válido
      const createCalls = (eventService.create as jest.Mock).mock.calls;
      createCalls.forEach(call => {
        expect(eventManagerIds).toContain(call[0].userId);
        expect(call[0]).toHaveProperty('name');
        expect(call[0]).toHaveProperty('bannerPhotoUrl');
        expect(call[0]).toHaveProperty('isPublic');
      });

      // Verificar que el resultado tiene la estructura correcta
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(initialData.events.length);
      result.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('bannerPhotoUrl');
        expect(event).toHaveProperty('isPublic');
        expect(event).toHaveProperty('userId');
        if (event.user && event.user.id) {
            expect(eventManagerIds).toContain(event.user.id);
        }
      });
    });
  });

  describe('insertNewPresentations', () => {
    it('debería crear nuevas presentaciones y asignarlas a eventos de forma rotativa', async () => {
      // Configurar los mocks para que coincidan con CreatePresentationDto
      const eventIds = ['event1', 'event2'];
      (presentationService.create as jest.Mock).mockImplementation((presentationData: CreatePresentationDto) => {
        return Promise.resolve({
          idPresentation: Math.random().toString(),
          place: presentationData.place,
          capacity: presentationData.capacity,
          openDate: presentationData.openDate,
          startDate: presentationData.startDate,
          price: presentationData.price,
          latitude: presentationData.latitude,
          longitude: presentationData.longitude,
          description: presentationData.description,
          ticketAvailabilityDate: presentationData.ticketAvailabilityDate,
          ticketSaleAvailabilityDate: presentationData.ticketSaleAvailabilityDate,
          city: presentationData.city,
          eventId: presentationData.eventId
        });
      });

      // Ejecutar el método a probar
      const result = await seedService.insertNewPresentations(eventIds);

      // Verificar que se llamaron todos los métodos necesarios
      expect(presentationService.deleteAll).toHaveBeenCalled();
      
      // Verificar que se creó cada presentación del initialData
      expect(presentationService.create).toHaveBeenCalledTimes(initialData.presentations.length);
      
      // Verificar que las presentaciones se asignaron a los eventos de forma rotativa
      const createCalls = (presentationService.create as jest.Mock).mock.calls;
      for (let i = 0; i < createCalls.length; i++) {
        const expectedEventId = eventIds[i % eventIds.length];
        expect(createCalls[i][0].eventId).toBe(expectedEventId);
        
        // Verificar campos de CreatePresentationDto
        expect(createCalls[i][0]).toHaveProperty('place');
        expect(createCalls[i][0]).toHaveProperty('capacity');
        expect(createCalls[i][0]).toHaveProperty('openDate');
        expect(createCalls[i][0]).toHaveProperty('startDate');
        expect(createCalls[i][0]).toHaveProperty('price');
        expect(createCalls[i][0]).toHaveProperty('latitude');
        expect(createCalls[i][0]).toHaveProperty('longitude');
        expect(createCalls[i][0]).toHaveProperty('description');
        expect(createCalls[i][0]).toHaveProperty('ticketAvailabilityDate');
        expect(createCalls[i][0]).toHaveProperty('ticketSaleAvailabilityDate');
        expect(createCalls[i][0]).toHaveProperty('city');
        expect(createCalls[i][0]).toHaveProperty('eventId');
      }

      // Verificar que el resultado tiene la estructura correcta
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(initialData.presentations.length);
      result.forEach(presentation => {
        expect(presentation).toHaveProperty('idPresentation');
        expect(presentation).toHaveProperty('place');
        expect(presentation).toHaveProperty('capacity');
        expect(presentation).toHaveProperty('openDate');
        expect(presentation).toHaveProperty('startDate');
        expect(presentation).toHaveProperty('price');
        expect(presentation).toHaveProperty('latitude');
        expect(presentation).toHaveProperty('longitude');
        expect(presentation).toHaveProperty('description');
        expect(presentation).toHaveProperty('ticketAvailabilityDate');
        expect(presentation).toHaveProperty('ticketSaleAvailabilityDate');
        expect(presentation).toHaveProperty('city');
        expect(presentation).toHaveProperty('eventId');
        if (presentation.event && presentation.event.id) {
            expect(eventIds).toContain(presentation.event.id);
        }
      });
    });
  });

    describe('insertNewTickets', () => {
    it('debería crear nuevos tickets con combinaciones de estados para cada usuario y presentación', async () => {
        const presentationIds = ['pres1', 'pres2', 'pres3', 'pres4'];
        const userIds = ['user1', 'user2'];

        (ticketService.create as jest.Mock).mockImplementation((ticketData: CreateTicketDto & { isActive: boolean, isRedeemed: boolean }) => {
        return Promise.resolve({
            id: Math.random().toString(),
            user: { id: ticketData.userId },
            presentation: { idPresentation: ticketData.presentationId },
            isActive: ticketData.isActive,
            isRedeemed: ticketData.isRedeemed
        });
        });

        const result = await seedService.insertNewTickets(presentationIds, userIds);

        expect(ticketService.deleteAll).toHaveBeenCalled();
        expect(ticketService.create).toHaveBeenCalledTimes(userIds.length * 2);

        const createCalls = (ticketService.create as jest.Mock).mock.calls;
        const combinations = [
        { isActive: false, isRedeemed: false },
        { isActive: true, isRedeemed: false },
        { isActive: true, isRedeemed: true }
        ];

        for (let i = 0; i < createCalls.length; i++) {
        const call = createCalls[i];
        const comboIndex = i % combinations.length;

        if (call[0]) {
            expect([true, false, undefined]).toContain(call[0].isActive);
            expect([true, false, undefined]).toContain(call[0].isRedeemed);
            expect(call[0]).toHaveProperty('userId');
            expect(call[0]).toHaveProperty('presentationId');
            expect(userIds).toContain(call[0].userId);
            expect(presentationIds).toContain(call[0].presentationId);  // 🔁 MOVIDO aquí
        }
        }

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(userIds.length * 2);
        result.forEach(ticket => {
        expect(ticket).toHaveProperty('id');
        expect(ticket).toHaveProperty('user');
        expect(ticket.user).toHaveProperty('id');
        expect(ticket).toHaveProperty('presentation');
        expect(ticket.presentation).toHaveProperty('idPresentation');
        expect(ticket).toHaveProperty('isActive');
        expect(ticket).toHaveProperty('isRedeemed');
        expect(userIds).toContain(ticket.user?.id);
        expect(presentationIds).toContain(ticket.presentation?.idPresentation);
        });


    });
    });
});
