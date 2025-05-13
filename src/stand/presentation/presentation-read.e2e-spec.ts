import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { Repository } from 'typeorm';
import { User } from "../../../src/auth/entities/user.entity";
import { getRepositoryToken } from '@nestjs/typeorm';
import e from 'express';
import { use } from 'passport';
import { IsDateString } from 'class-validator';
import { initialData } from '../../../src/seed/data/seed-data';


const testingUser = {
  email: 'gus@mail.com',
  password: 'Abc123',
  name: 'Testing',
  lastname: 'teacher',
};

const testingClient2={
  email: 'gusso2@mail.com',
    password: 'Abc12345',
    name: 'Testing',
    lastname: 'user',

}
const testingClient1={
  email: 'gusso3@mail.com',
    password: 'Abc12345',
    name: 'Testing',
    lastname: 'user',

}

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

var adminToken = "";
var userId1 = "";
var userId2 = "";
var userToken= "";
var managerToken = "";
var presentationId = ""; // Declare presentationId at the top level

describe('PresentationsModule - Find one by ID (e2e)', () => {
  let app: INestApplication;
  let userRepository : Repository<User>;

  beforeEach(async () => {
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
    
    const responseAdmin = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingAdminUser);
    adminToken = responseAdmin.body.token;

    const responseUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingClient1);
    
    const responseUser2 = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingClient2);

    adminToken = responseAdmin.body.id; 
    userToken = responseUser.body.id 
    userId1= responseUser.body.id 
    userId2 = responseUser2.body.id 
    await userRepository.update(
      { email: testingAdminUser.email },
      { roles: ['admin'] },

    );

    const responseEventManager = await request(app.getHttpServer())  
      .post('/auth/register/event-manager')
      .send(testingEventManager)

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
        

    // Create presentation
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
        eventManId: eventId
      });
    
    console.log('Presentation creation response:', presentationRes.status, presentationRes.body);
    expect(presentationRes.status).toBe(201);
    presentationId = presentationRes.body.idPresentation;  // Assign value to the top-level variable
   

  }, 10000);
   // Increased timeout for all setup operations

  afterAll(async () => {
    // Clean up test data
    await userRepository.delete({ email: testingUser.email });
    await userRepository.delete({ email: testingAdminUser.email });
    await userRepository.delete({ email: testingEventManager.email });
    await app.close();
  });

  
    it('should allow an admin to get a presentation by ID', async () => {
      console.log('Admin token for finding presentation:', adminToken);
      console.log('Presentation ID to find:', presentationId);
      
      const response = await request(app.getHttpServer())
        .get(`/presentation/${presentationId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      console.log('Admin get presentation response:', response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(presentationId);
      expect(response.body).toHaveProperty('place', 'Stadium Pascual');
    });

    it('should allow an event manager to get a presentation by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/presentation/${presentationId}`)
        .set('Authorization', `Bearer ${managerToken}`);
      
      console.log('Event manager get presentation response:', response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(presentationId);
    });

    it('should forbid a client from getting a presentation by ID', async () => {

      const response = await request(app.getHttpServer())
        .get(`/presentation/${presentationId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      console.log('Client get presentation response:', response.status, response.body);
      expect(response.status).toBe(403); // Forbidden for clients
    });

    // it('should allow an admin to get all presentations', async () => {
    //   const response = await request(app.getHttpServer())
    //     .get('/presentation')
    //     .set('Authorization', `Bearer ${adminToken}`);
      
    //   console.log('Admin get all presentations response:', response.status);
    //   expect(response.status).toBe(200);
    //   expect(Array.isArray(response.body)).toBe(true);
    //   expect(response.body.length).toBeGreaterThan(0);
      
    //   // Check if our created presentation is in the list
    //   const foundPresentation = response.body.find(p => p.id === presentationId);
    //   expect(foundPresentation).toBeDefined();
    // });

    // it('should allow an event manager to get all presentations', async () => {
    //   const response = await request(app.getHttpServer())
    //     .get('/presentation')
    //     .set('Authorization', `Bearer ${managerToken}`);
      
    //   console.log('Event manager get all presentations response:', response.status);
    //   expect(response.status).toBe(200);
    //   expect(Array.isArray(response.body)).toBe(true);
    // });

    // it('should return 401 when no token is provided', async () => {
    //   const response = await request(app.getHttpServer())
    //     .get('/presentation');
      
    //   console.log('No token get all presentations response:', response.status);
    //   expect(response.status).toBe(401); // Unauthorized without token
    // });
});