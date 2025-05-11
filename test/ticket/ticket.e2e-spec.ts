import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';


describe('TicketController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/tickets (GET) should return 200', () => {
    return request(app.getHttpServer())
      .get('/tickets')
      .expect(200);
  });

  it('/tickets/buy (POST) should return 401 without token', () => {
    return request(app.getHttpServer())
      .post('/tickets/buy')
      .send({
        presentationId: 'uuid',
        quantity: 1,
        paymentMethod: 'card',
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
