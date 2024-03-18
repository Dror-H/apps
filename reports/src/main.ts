import { BunyanLoggerService } from '@nest-toolbox/bunyan-logger';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as chalk from 'chalk';
import { ReportsModule } from './app/reports.module';
import { config } from '@instigo-app/api-shared';

const logger: Logger = new Logger('Bootstrap');

function logInfo() {
  const { redis_url, environment } = config();
  logger.log(chalk.blue.magenta(`📮 Connected to ${redis_url}`), 'Bootstrap');
  logger.log(chalk.blue.bold(`✅ Server running`), 'Bootstrap');
  logger.log(chalk.red.bold(`🚀 Server is using ${environment} environment`));
}

declare const module: any;
async function bootstrap() {
  const { redis_url } = config();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ReportsModule, {
    transport: Transport.REDIS,
    options: {
      url: redis_url,
    },
    logger: new BunyanLoggerService({
      projectId: 'reports',
      formatterOptions: {
        outputMode: 'short',
      },
    }),
  });

  app.listen(() => {
    logInfo();
  });

  // HMR
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
