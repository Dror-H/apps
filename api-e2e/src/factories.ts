import { AppModule } from '@api/app.module';
import { DatabaseConfigService } from '@api/database/database.config.service';
import { MailerService } from '@nestjs-modules/mailer';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { mockMailerService } from './mocks/mock-mailer.service';
import { mockTypeOrmConfigService } from './mocks/mock-typeorm-config.service';

export async function nestAppFactory(): Promise<{ app: INestApplication; moduleFixture: TestingModule }> {
  const envFilePath = join(__dirname, '../test.env');
  const moduleFixture = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: envFilePath,
      }),
      AppModule,
    ],
  })
    .overrideProvider(DatabaseConfigService)
    .useValue(mockTypeOrmConfigService)
    .overrideProvider(MailerService)
    .useValue(mockMailerService)
    // .overrideProvider(BullConfigService)
    // .useValue(mockRedis)
    // .overrideProvider(CacheConfigService)
    // .useValue(mockCaching)
    .compile();

  const app: any = moduleFixture.createNestApplication(null, {
    bodyParser: false,
  });

  /* Use this when tests are running in band */
  const configService = moduleFixture.get<ConfigService>(ConfigService);
  await app.listen(configService.get('PORT'), '0.0.0.0');

  /* Use this when tests are running in parallel */
  // await app.init();

  return { app, moduleFixture };
}
