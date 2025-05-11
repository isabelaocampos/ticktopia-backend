import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';

describe('EventModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [EventController],
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();
  });

  afterEach(async () => {
    await module?.close?.();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have EventService as provider', () => {
    const service = module.get(EventService);
    expect(service).toBeDefined();
  });

  it('should have EventController as controller', () => {
    const controller = module.get(EventController);
    expect(controller).toBeDefined();
  });
});
