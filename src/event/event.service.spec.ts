import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';

const mockEventRepo = {};
const mockUserRepo = {};

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: 'EventRepository', useValue: mockEventRepo },
        { provide: 'UserRepository', useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
