import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { nestAppFactory } from './factories';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const execSync = require('child_process').execSync;

describe('Api e2e', () => {
  let app: INestApplication;
  let prisma;

  beforeAll(async () => {
    const output = execSync('sh ./apps/audiences-api-e2e/seed.sh', { encoding: 'utf-8' }); // the default is 'buffer'
    console.log('Output was:\n', output);
    const factory = await nestAppFactory();
    app = factory.app;

    prisma = factory.moduleFixture.get<PrismaService>('PrismaService');
  });

  it('/ (GET)', () => request(app.getHttpServer()).get('/').expect(200));

  it('/ (Not Found)', () => request(app.getHttpServer()).get('/not-found').expect(404));

  afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE auth_tokens, _ad_account_to_user, ad_accounts, user_targetings, users CASCADE;`;
    await app.close();
  });
});
