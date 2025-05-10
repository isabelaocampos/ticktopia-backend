import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

const mockEventRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  })),
});

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
});

describe('EventService', () => {
  let service: EventService;
  let eventRepo: jest.Mocked<Repository<Event>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: getRepositoryToken(Event), useFactory: mockEventRepository },
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepo = module.get(getRepositoryToken(Event));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should throw if user not found', async () => {
      userRepo.findOneBy.mockResolvedValue(null);

      await expect(service.create({ userId: '123' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if user lacks permission', async () => {
      userRepo.findOneBy.mockResolvedValue({ roles: ['user'] } as User);

      await expect(service.create({ userId: '123' } as any)).rejects.toThrow(ForbiddenException);
    });

    it('should create and return the event', async () => {
      const user = { id: 'u1', roles: [ValidRoles.admin] } as User;
      const event = { id: 'e1', name: 'test' } as Event;

      userRepo.findOneBy.mockResolvedValue(user);
      eventRepo.create.mockReturnValue(event);
      eventRepo.save.mockResolvedValue(event);

      const result = await service.create({ userId: 'u1', name: 'test' } as any);

      expect(result).toBe(event);
      expect(eventRepo.create).toHaveBeenCalled();
      expect(eventRepo.save).toHaveBeenCalledWith(expect.objectContaining({ user }));
    });
  });

  describe('findAll', () => {
    it('should return a list of events', async () => {
      const events = [{ id: '1' }, { id: '2' }];
      eventRepo.find.mockResolvedValue(events as Event[]);
      const result = await service.findAll();
      expect(result).toBe(events);
    });
  });

  describe('findOne', () => {
    it('should throw if event not found', async () => {
      eventRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent-id', {} as User)).rejects.toThrow(NotFoundException);
    });

    it('should restrict access for event-managers to own events', async () => {
      const event = { id: 'e1', user: { id: 'u2' } } as Event;
      eventRepo.findOne.mockResolvedValue(event);

      await expect(service.findOne('e1', {
        id: 'u1',
        roles: [ValidRoles.eventManager],
      } as User)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update and return the updated event', async () => {
      const event = { id: 'e1', user: { id: 'u1' } } as Event;
      eventRepo.findOne.mockResolvedValue(event);
      eventRepo.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(service, 'findOne').mockResolvedValue(event);

      const result = await service.update('e1', { name: 'updated' } as any, {
        id: 'u1',
        roles: [ValidRoles.eventManager],
      } as User);

      expect(result).toBe(event);
    });
  });

  describe('remove', () => {
    it('should delete event if allowed', async () => {
      const event = { id: 'e1', user: { id: 'u1' } } as Event;
      eventRepo.findOne.mockResolvedValue(event);
      eventRepo.remove.mockResolvedValue(event);

      const result = await service.remove('e1', {
        id: 'u1',
        roles: [ValidRoles.eventManager],
      } as User);

      expect(result).toBe(event);
    });
  });
});
