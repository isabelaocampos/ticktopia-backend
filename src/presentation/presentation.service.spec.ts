import { Test, TestingModule } from '@nestjs/testing';
import { PresentationService } from './presentation.service';

const mockPresentationRepository = {
  find: jest.fn(),
  save: jest.fn(),
};

const mockEventRepository = {
  find: jest.fn(),
  save: jest.fn(),
};

describe('PresentationService', () => {
  let service: PresentationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresentationService,
        {
          provide: 'PresentationRepository',
          useValue: mockPresentationRepository,
        },
        {
          provide: 'EventRepository',
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<PresentationService>(PresentationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
