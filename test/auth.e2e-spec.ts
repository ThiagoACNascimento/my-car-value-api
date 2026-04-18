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

  afterEach(async () => {
    await app.close();
  });
});
