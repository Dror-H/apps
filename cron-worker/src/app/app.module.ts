import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AudiencesJobsModule } from './audiences/audiences-jobs.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { InstigoJobsModule } from './instigo/instigo-jobs.module';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: { transport: process.env.ENVIRONMENT === 'development' ? { target: 'pino-pretty' } : undefined },
    }),
    AudiencesJobsModule,
    InstigoJobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
