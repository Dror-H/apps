/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */ import { BootstrapLog } from '@nest-toolbox/bootstrap-log';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Logger as pino } from 'nestjs-pino';
import { config } from '@instigo-app/api-shared';

async function bootstrap(): Promise<void> {
  const { environment, hostname, packageBody, serverPort } = config();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(pino));
  await app.listen(serverPort);
  BootstrapLog({ config: { environment, hostname, package_json_body: packageBody } });
}

void bootstrap();
