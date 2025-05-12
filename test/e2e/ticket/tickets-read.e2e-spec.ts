import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('Tickets - Read (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let ticketId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Register user
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'reader@mail.com',
        password: 'Abc12345',
        name: 'Reader',
        lastname: 'User',
      });

    token = res.body.token;

    // Create event and presentation
    const event = await request(app.getHttpServer())
      .post('/event/createEvent')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Read Event',
        bannerPhotoUrl: 'img-url',
        isPublic: true,
      });

    const presentation = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        place: 'Venue',
        eventId: event.body.id,
        latitude: 1,
        longitude: 1,
        description: 'A show',
        openDate: new Date(),
        startDate: new Date(),
        ticketAvailabilityDate: new Date(),
        ticketSaleAvailabilityDate: new Date(),
        city: 'Bogotá',
        capacity: 50,
        price: 200,
      });

    // Buy ticket
    const ticketRes = await request(app.getHttpServer())
      .post('/tickets/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({
        presentationId: presentation.body.idPresentation,
        quantity: 1,
      });

    ticketId = ticketRes.body.id;
  });

  it('/api/tickets (GET) - should get all tickets', async () => {
    const res = await request(app.getHttpServer())
      .get('/tickets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/api/tickets/:id (GET) - should get ticket by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', ticketId);
  });
});
