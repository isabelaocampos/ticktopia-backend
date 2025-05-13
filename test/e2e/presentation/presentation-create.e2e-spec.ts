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

describe('Presentations - Create (e2e)', () => {
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

  }, 10000);

  afterAll(async () => {
    // await userRepository.delete({ email: testingUser.email });
    // await userRepository.delete({ email: testingAdminUser.email });
    // await userRepository.delete({ email: testingEventManager.email });
    await app.close();
  });

  it('should allow an admin to create a presentation', async () => {
    const loginAdmin = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
        email: testingAdminUser.email,
        password: testingAdminUser.password,
    });
    adminToken = loginAdmin.body.token;

    const response = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: testingAdminUser.email,
        password: testingAdminUser.password,
    });
        //Create presentation
    const res = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        place: 'Stadium Pascual',
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
        eventId: 'eventId'
      });
  });  

  it('should forbid a client to create a presentation', async () => {
    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
        email: testingUser.email,
        password: testingUser.password,
    });
    adminToken = login.body.token;

    const response = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: testingAdminUser.email,
        password: testingAdminUser.password,
    });
        //Create presentation
    const res = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        place: 'Stadium Pascual',
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
        eventId: 'eventId'
      });
  });  


  
});
