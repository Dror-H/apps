import { AppModule } from '@api/app.module';
import { AllExceptionsFilter, config, httpsSettings } from '@instigo-app/api-shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import * as chalk from 'chalk';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import { Logger as pino } from 'nestjs-pino';
import * as path from 'path';
import * as requestIp from 'request-ip';
const helmet = require('helmet');

const logger: Logger = new Logger('Bootstrap');

function logInfo(): void {
  const { hostname, environment, redis_url } = config();
  logger.log(chalk.blue.bold(`✅ Server running on 👉 ${hostname}`), 'Bootstrap');
  logger.log(chalk.green.bold(`📄 Swagger 👉 ${hostname}/swagger/`));
  logger.log(chalk.green.bold(`🩺 Check Health 👉 ${hostname}/health`));
  logger.log(chalk.magenta.bold(`📮 Connected to ${redis_url}`), 'Bootstrap');
  logger.log(chalk.red.bold(`🚀 Server is using ${environment} environment`));
}

function setupSwagger(options: { app }): OpenAPIObject {
  const { packageBody } = config();
  const { app } = options;
  // Swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Instigo')
    .setDescription('The Instigo API description')
    .setVersion(packageBody.version)
    .addBearerAuth()
    .addTag('instigo')
    .build();

  const swaggerSpec = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, swaggerSpec);
  return swaggerSpec;
}

function setupApp({ app }): void {
  app.useStaticAssets(`${path.resolve('.')}/apps/api/src/public`);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(compression());
  app.use(requestIp.mw());

  app.enableCors();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
          baseUri: ["'self'"],
          fontSrc: ["'self'", 'https:', 'data:'],
        },
      },
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
      statusCode: 200,
      message: {
        status: 429,
        error: 'You are doing that too much. Please try again in 10 minutes.',
      },
    }),
  );

  const jsonParseMiddleware = json({ limit: '100mb' });
  app.use((req: any, res: any, next: any) => {
    // do not parse json bodies if we are hitting file uploading controller
    if (req.path.indexOf('/stripe/webhook') === 0) {
      next();
    } else {
      jsonParseMiddleware(req, res, next);
    }
  });
  app.use(urlencoded({ extended: true, limit: '100mb' }));
}

declare const module: any;

async function bootstrap(): Promise<void> {
  const { serverPort, environment, packageBody } = config();
  const serviceConfig = {
    bodyParser: false,
    ...httpsSettings(environment),
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, serviceConfig);

  setupApp({ app });
  setupSwagger({ app });
  app.useLogger(app.get(pino));

  await app.listen(serverPort, () => {
    logInfo();
  });

  // HMR
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
