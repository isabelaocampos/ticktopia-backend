import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('Tickets - Create (e2e)', () => {
  let app: INestApplication;
  let managerToken: string;
  let clientToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Login como Event Manager (Isabella)
    const managerRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'isabella.ocampo@u.icesi.edu.co',
        password: 'Hola1597!!!',
      });

    managerToken = managerRes.body.token;

    // Login como Client (Valentina)
    const clientRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'valentina.gonzalez3@u.icesi.edu.co',
        password: 'Hola1597!!!',
      });

    clientToken = clientRes.body.token;
  });

  it('should create a ticket', async () => {
    // Crear evento como manager
    const eventRes = await request(app.getHttpServer())
      .post('/event/createEvent')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        name: 'Concert Test',
        bannerPhotoUrl: 'https://image.com/photo.jpg',
        isPublic: true,
      });

    expect(eventRes.status).toBe(201);

    const eventId = eventRes.body.id;

    // Crear presentación asociada al evento
    const presentationRes = await request(app.getHttpServer())
      .post('/presentation')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        place: 'Stadium',
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
        price: 50,
      });

    expect(presentationRes.status).toBe(201);
    const presentationId = presentationRes.body.idPresentation;

    // Comprar ticket como client
    const ticketRes = await request(app.getHttpServer())
      .post('/tickets/buy')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        presentationId,
        quantity: 1,
      });

    expect(ticketRes.status).toBe(201);
    expect(ticketRes.body).toHaveProperty('id');
    expect(ticketRes.body.quantity).toBe(1);
  });
});
