import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { Repository } from 'typeorm';
import { User } from "../../../src/auth/entities/user.entity";
import { getRepositoryToken } from '@nestjs/typeorm';
import e from 'express';
import { use } from 'passport';


const testingUser = {
  email: 'gus@mail.com',
  password: 'Abc123',
  name: 'Testing',
  lastname: 'teacher',
};

const testingAdminUser = {
  email: 'testing.admin@google.com',
  password: 'abc123',
  name: 'Testing',
  lastname: 'admin',
};

const testingEventManager ={
  email: 'testing.eventmanag@google.com',
  password: 'aBc123',
  name: 'TestingEv',
  lastname: 'eventMan',

};

describe('Tickets - Create (e2e)', () => {
  let app: INestApplication;
  let userRepository : Repository<User>;
  let clientId : string;
  let managerToken: string;
  let adminToken: string;
  let presentationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    const responseUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingUser);
    
    const responseAdmin = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingAdminUser);

    clientId = responseUser.body.id; // Assign clientId after registering the testingUser

    const responseEventManager = await request(app.getHttpServer())  
      .post('/auth/register/event-manager')
      .send(testingEventManager);

    await userRepository.update(
      { email: testingAdminUser.email },
      { roles: ['admin'] },
    );

    await userRepository.update(
      { email: testingEventManager.email },
      { roles: ['event-manager'] },
    );

    //login admin and event manager

    const loginAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testingAdminUser.email,
        password: testingAdminUser.password,
    }); 
    adminToken = loginAdmin.body.token;

    const loginEventManager = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testingEventManager.email,
        password: testingEventManager.password,
    });
    managerToken = loginEventManager.body.token;

    //Create event as event manager
    const eventRes = await request(app.getHttpServer())
      .post('/event/create')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        name: 'Concert Test',
        bannerPhotoUrl: 'https://image.com/photo.jpg',
        isPublic: true,
      });
      const eventId = eventRes.body.id;

    //Create presentation
    const presentationRes = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        place: 'Stadium Pascual',
        eventId,
        latitude: 0,
        longitude: 0,
        description: 'Live concert',
        openDate: new Date(),
        startDate: new Date(),
        ticketAvailabilityDate: new Date(),
        ticketSaleAvailabilityDate: new Date(),
        city: 'Cali',
        capacity: 100,
        price: 500,
        eventManId: 'eventId'
        });

      presentationId = presentationRes.body.idPresentation;
  }, 10000);

  afterAll(async () => {
    await userRepository.delete({ email: testingUser.email });
    await userRepository.delete({ email: testingAdminUser.email });
    await userRepository.delete({ email: testingEventManager.email });
    await app.close();
  });

  it('should allow an admin to create a ticket', async () => {
    // const loginAdmin = await request(app.getHttpServer())
    // .post('/auth/login')
    // .send({
    //     email: testingAdminUser.email,
    //     password: testingAdminUser.password,
    // });
    // adminToken = loginAdmin.body.token;
    // expect(loginAdmin.status).toBe(201);


    const res = await request(app.getHttpServer())
    .post('/tickets/admin')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      userId: 'clientId',
      presentationId: 'presentationId',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.user.id).toBe(clientId);
    expect(res.body.presentation.id).toBe('presentationId');
  });

  it('should forbid a client from creating a ticket', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testingUser.email,
        password: testingUser.password,
    });

    const res = await request(app.getHttpServer())
      .post('/tickets/admin')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        userId: clientId,
        presentationId: 'presentationId',
      });
      expect(res.status).toBe(403);
  });

  
});
