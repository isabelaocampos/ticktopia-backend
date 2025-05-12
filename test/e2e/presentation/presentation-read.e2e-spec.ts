import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('Presentation - Read (e2e)', () => {
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
      .send({ email: 'present2@mail.com', password: 'Abc12345', name: 'User', lastname: 'Test' });
    token = userRes.body.token;
  });

  it('should return all presentations (can be empty or with items)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/presentation')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 204]).toContain(res.status);
    expect(res.body).toBeDefined();
  });
});
