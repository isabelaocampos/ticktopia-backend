import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from "../../../src/app.module";
import { Repository } from 'typeorm';
import { User } from '../../../src/auth/entities/user.entity';
import { ValidRoles } from '..//../../src/auth/enums/valid-roles.enum';
import { CreateEventDto } from '../../../src/event/dto/create-event.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

const testingEvent = {
  
}



describe('EventsController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let tokenEventManager: string;
  let tokenClient: string;
  let userEventManager: User;
  let userClient: User;

  const baseEventDto: Partial<CreateEventDto> = {
    name: 'My Awesome Event',
    bannerPhotoUrl: 'https://example.com/banner.jpg',
    isPublic: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Seed usuarios
    userEventManager = await userRepository.save({
    name: 'Event',
    lastname: 'Manager',
    email: 'manager@example.com',
    password: 'hashedpass',
    roles: [ValidRoles.eventManager],
    });

    userClient = await userRepository.save({
    name: 'Regular',
    lastname: 'Client',
    email: 'client@example.com',
    password: 'hashedpass',
    roles: [ValidRoles.client],
    });



    // Login para obtener tokens
    const loginManager = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEventManager.email, password: 'hashedpass' });

    tokenEventManager = loginManager.body.token;

    const loginClient = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userClient.email, password: 'hashedpass' });

    tokenClient = loginClient.body.token;
  });

  afterAll(async () => {
    await userRepository.delete({});
    await app.close();
  });

  it('✅ debería crear un evento si el usuario tiene el rol permitido', async () => {
    const response = await request(app.getHttpServer())
      .post('/event/create')
      .set('Authorization', `Bearer ${tokenEventManager}`)
      .send({
        ...baseEventDto,
        userId: userEventManager.id,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(baseEventDto.name);
  });

  it('🚫 debería retornar 403 si el usuario no tiene permisos', async () => {
    const response = await request(app.getHttpServer())
      .post('/event/create')
      .set('Authorization', `Bearer ${tokenClient}`)
      .send({
        ...baseEventDto,
        userId: userClient.id,
      })
      .expect(403);

    expect(response.body.message).toMatch(/permission/);
  });

  it('🚫 debería retornar 404 si el userId no existe', async () => {
    const fakeUserId = '11111111-1111-1111-1111-111111111111';

    const response = await request(app.getHttpServer())
      .post('/event/create')
      .set('Authorization', `Bearer ${tokenEventManager}`)
      .send({
        ...baseEventDto,
        userId: fakeUserId,
      })
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });

  it('🚫 debería retornar 400 si falta un campo obligatorio', async () => {
    const { name, ...incompleteDto } = baseEventDto;

    const response = await request(app.getHttpServer())
      .post('/event/create')
      .set('Authorization', `Bearer ${tokenEventManager}`)
      .send({
        ...incompleteDto,
        userId: userEventManager.id,
      })
      .expect(400);

    expect(response.body.message).toContain('name should not be empty');
  });

  it('🚫 debería retornar 400 si el userId no es un UUID válido', async () => {
    const response = await request(app.getHttpServer())
      .post('/event/create')
      .set('Authorization', `Bearer ${tokenEventManager}`)
      .send({
        ...baseEventDto,
        userId: 'not-a-uuid',
      })
      .expect(400);

    expect(response.body.message).toContain('userId must be a UUID');
  });
});
