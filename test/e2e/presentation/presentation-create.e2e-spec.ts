import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('Presentation - Create (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const userRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'present1@mail.com', password: 'Abc12345', name: 'User', lastname: 'Test' });
    token = userRes.body.token;
  });

  it('should create a presentation', async () => {
    const event = await request(app.getHttpServer())
      .post('/api/event/createEvent')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Event A', bannerPhotoUrl: 'url', isPublic: true });

    const response = await request(app.getHttpServer())
      .post('/api/presentation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        place: 'Auditorium',
        eventId: event.body.id,
        latitude: 0,
        longitude: 0,
        description: 'Description',
        openDate: new Date(),
        startDate: new Date(),
        ticketAvailabilityDate: new Date(),
        ticketSaleAvailabilityDate: new Date(),
        city: 'City',
        capacity: 100,
        price: 100,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idPresentation');
  });
});
