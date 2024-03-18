import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { nestAppFactory } from './factories';
import * as faker from 'faker';
import { UserRepository } from '@api/user/data/user.repository';
import { fixture_user } from './fixtures/user';
import to from 'await-to-js';

describe('Auth e2e', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const factory = await nestAppFactory();
    app = factory.app;
    moduleFixture = factory.moduleFixture;
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    await to(userRepository.save({ email: fixture_user.email, password: fixture_user.password })).catch();
  });

  it('/ (GET)', () => request(app.getHttpServer()).get('/').expect(200));

  it('should allow everyone to signup when using valid credentials', async () => {
    const response = await request(app.getHttpServer()).post('/auth/signup').send({
      email: faker.internet.email(),
      password: 'strongpassword',
    });
    expect(response.status === 201 && response.body.token).toBeTruthy();
  });

  it('should NOT allow an already existing user to signup', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: fixture_user.email, password: fixture_user.password });
    expect(response.status).toEqual(409);
  });

  afterAll(async () => {
    await app.close();
  });
});
