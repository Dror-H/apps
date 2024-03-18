import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { nestAppFactory } from './factories';
describe('Api e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const factory = await nestAppFactory();
    app = factory.app;
  });

  it('/ (GET)', () => request(app.getHttpServer()).get('/').expect(200));

  it('/ (Not Found)', () => request(app.getHttpServer()).get('/not-found').expect(404));

  afterAll(async () => {
    await app.close();
  });
});
