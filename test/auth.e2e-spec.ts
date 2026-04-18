import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles a signup request', () => {
    const email = 'adfsdasdffafds@fdassf.dsf';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'dsfas' })
      .expect(201)
      .then((response: { body: { id: string; email: string } }) => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toBeDefined();
        expect(email).toEqual('adfsdasdffafds@fdassf.dsf');
      });
  });

  it('signup as a new user then get th currently logged in user', async () => {
    const email = 'asdfs@fadsf.adf';

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asd' })
      .expect(201);

    const cookie: string[] = response.get('Set-Cookie') || [];

    const { body } = (await request(app.getHttpServer())
      .get('/auth/WhoAmI')
      .set('Cookie', cookie)
      .expect(200)) as { body: { id: number; email: string } };

    expect(body.email).toEqual(email);
  });

  afterEach(async () => {
    await app.close();
  });
});
