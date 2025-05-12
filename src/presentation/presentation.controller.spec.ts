import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from '../../src/presentation/presentation.controller';
import { PresentationService } from '../../src/presentation/presentation.service';
import { NotFoundException } from '@nestjs/common';

describe('PresentationController', () => {
  let controller: PresentationController;
  let service: PresentationService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      providers: [
        {
          provide: PresentationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PresentationController>(PresentationController);
    service = module.get<PresentationService>(PresentationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should return created presentation', async () => {
      const dto = { place: 'Test Place', eventId: 'e1' };
      const expected = { idPresentation: 'p1', ...dto };
      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto as any);
      expect(result).toEqual(expected);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });

    it('should log and throw error on failure', async () => {
      mockService.create.mockRejectedValue(new Error('fail'));
      await expect(controller.create({} as any)).rejects.toThrow('fail');
    });
  });

  describe('findAll()', () => {
    it('should return all presentations', async () => {
      const data = [{ idPresentation: 'p1' }];
      mockService.findAll.mockResolvedValue(data);
      const result = await controller.findAll();
      expect(result).toEqual(data);
    });

    it('should throw error on service failure', async () => {
      mockService.findAll.mockRejectedValue(new Error('fetch fail'));
      await expect(controller.findAll()).rejects.toThrow('fetch fail');
    });
  });

  describe('findOne()', () => {
    it('should return one presentation', async () => {
      const data = { idPresentation: 'p1' };
      mockService.findOne.mockResolvedValue(data);
      const result = await controller.findOne('p1');
      expect(result).toEqual(data);
    });

    it('should throw NotFound if no presentation', async () => {
      mockService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw and log if error occurs', async () => {
      mockService.findOne.mockRejectedValue(new Error('lookup fail'));
      await expect(controller.findOne('id')).rejects.toThrow('lookup fail');
    });
  });

  describe('update()', () => {
    it('should return updated presentation', async () => {
      const updateDto = { place: 'new' };
      const updated = { idPresentation: 'p1', place: 'new' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('p1', updateDto as any);
      expect(result).toEqual(updated);
    });

    it('should throw NotFound if not updated', async () => {
      mockService.update.mockResolvedValue(null);
      await expect(controller.update('x', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should handle error in update', async () => {
      mockService.update.mockRejectedValue(new Error('fail'));
      await expect(controller.update('x', {} as any)).rejects.toThrow('fail');
    });
  });

  describe('remove()', () => {
    it('should return success message', async () => {
      mockService.remove.mockResolvedValue({ idPresentation: 'p1' });
      const result = await controller.remove('p1');
      expect(result).toEqual({ message: 'Presentation with ID p1 has been deleted successfully' });
    });

    it('should throw NotFound if not found', async () => {
      mockService.remove.mockResolvedValue(null);
      await expect(controller.remove('x')).rejects.toThrow(NotFoundException);
    });

    it('should handle error in remove', async () => {
      mockService.remove.mockRejectedValue(new Error('remove fail'));
      await expect(controller.remove('x')).rejects.toThrow('remove fail');
    });
  });
});
