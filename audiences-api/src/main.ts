import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { AllExceptionsFilter, config, httpsSettings } from '@instigo-app/api-shared';
import { BootstrapLog } from '@nest-toolbox/bootstrap-log';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger as pino } from 'nestjs-pino';
import { AppModule } from './app/app.module';

function setupSwagger(options: { app }): OpenAPIObject {
  const { packageBody } = config();
  const { app } = options;
  const swaggerOptions = new DocumentBuilder()
    .setTitle('InstigoAudiences')
    .setDescription('The Instigo API description')
    .setVersion(packageBody.version)
    .addBearerAuth()
    .addTag('instigo')
    .build();
  patchNestjsSwagger(); // <--- This is the hacky patch using prototypes (for now)
  const swaggerSpec = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, swaggerSpec);
  return swaggerSpec;
}

async function bootstrap(): Promise<void> {
  const { environment, packageBody, serverPort } = config();

  const serviceConfig = {
    bodyParser: false,
    ...httpsSettings(environment),
  };
  const app = await NestFactory.create(AppModule, serviceConfig);
  app.enableCors();
  app.useLogger(app.get(pino));
  app.use(cookieParser());
  app.use(compression());
  app.useGlobalFilters(new AllExceptionsFilter());

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

  setupSwagger({ app });
  const port = serverPort || 3001;
  await app.listen(port, () => {
    const { hostname, environment, database_url } = config();
    BootstrapLog({ config: { environment, hostname, package_json_body: packageBody, database_url, swagger: true } });
  });
}

void bootstrap();
