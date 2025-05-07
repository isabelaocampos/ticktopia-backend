import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presentation } from './entities/presentation.entity';

describe('PresentationController', () => {
  let controller: PresentationController;

  const mockPresentationService = {
    // Agrega aquí los métodos mock que uses en el controller
    findAll: jest.fn(() => ['presentation1', 'presentation2']),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      providers: [
        {
          provide: PresentationService,
          useValue: mockPresentationService,
        },
      ],
    }).compile();

    controller = module.get<PresentationController>(PresentationController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
