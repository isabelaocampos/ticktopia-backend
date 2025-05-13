import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('Payments - Stripe Checkout (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'stripe@mail.com', password: 'Abc12345', name: 'Stripe', lastname: 'User' });

    token = res.body.token;
  });

  it('should create a Stripe checkout session', async () => {
    const event = await request(app.getHttpServer())
      .post('/api/event/createEvent')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'EventStripe', bannerPhotoUrl: 'img', isPublic: true });

    const presentation = await request(app.getHttpServer())
      .post('/api/presentation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        place: 'Stripe Arena',
        eventId: event.body.id,
        latitude: 0,
        longitude: 0,
        description: 'Checkout test',
        openDate: new Date(),
        startDate: new Date(),
        ticketAvailabilityDate: new Date(),
        ticketSaleAvailabilityDate: new Date(),
        city: 'City',
        capacity: 100,
        price: 100
      });

    const checkoutResponse = await request(app.getHttpServer())
      .post('/api/tickets/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        quantity: 1,
        userId: token, // o guarda el id del usuario si lo tienes separado
        presentationId: presentation.body.idPresentation
      });

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body).toContain('http');
  });
});
