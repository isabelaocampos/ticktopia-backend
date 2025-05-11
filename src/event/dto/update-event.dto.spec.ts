import { validate } from 'class-validator';
import { UpdateEventDto } from './update-event.dto';

describe('UpdateEventDto', () => {
  it('should validate with all valid fields', async () => {
    const dto = new UpdateEventDto();
    dto.name = 'Updated Event';
    dto.bannerPhotoUrl = 'https://example.com/updated.jpg';
    dto.isPublic = false;
    dto.userId = 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with no fields provided', async () => {
    const dto = new UpdateEventDto(); // all fields optional
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is not a string', async () => {
    const dto = new UpdateEventDto();
    // @ts-ignore: intentionally wrong type
    dto.name = 123;

    const errors = await validate(dto);
    const nameError = errors.find(err => err.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail if isPublic is not a boolean', async () => {
    const dto = new UpdateEventDto();
    // @ts-ignore: intentionally wrong type
    dto.isPublic = 'yes';

    const errors = await validate(dto);
    const isPublicError = errors.find(err => err.property === 'isPublic');
    expect(isPublicError).toBeDefined();
  });

  it('should fail if userId is not a valid UUID', async () => {
    const dto = new UpdateEventDto();
    dto.userId = 'not-a-uuid';

    const errors = await validate(dto);
    const userIdError = errors.find(err => err.property === 'userId');
    expect(userIdError).toBeDefined();
  });
});
