import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('Tickets - Update (e2e)', () => {
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

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'ticket3@mail.com', password: 'Abc12345', name: 'User', lastname: 'Test' });
    token = res.body.token;

    const event = await request(app.getHttpServer())
      .post('/event/createEvent')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Event2', bannerPhotoUrl: 'url', isPublic: true });

    const presentation = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${token}`)
      .send({ place: 'Arena', eventId: event.body.id, latitude: 0, longitude: 0, description: 'desc', openDate: new Date(), startDate: new Date(), ticketAvailabilityDate: new Date(), ticketSaleAvailabilityDate: new Date(), city: 'City', capacity: 100, price: 100 });

    const buy = await request(app.getHttpServer())
      .post('/tickets/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ presentationId: presentation.body.idPresentation, quantity: 1 });

    ticketId = buy.body.id;
  });

  it('should update a ticket', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isRedeemed: true });

    expect(res.status).toBe(200);
    expect(res.body.isRedeemed).toBe(true);
  });
});