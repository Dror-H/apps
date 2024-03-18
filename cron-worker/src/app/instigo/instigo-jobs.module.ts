import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HttpCronService } from './http.cron.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [HttpCronService],
})
export class InstigoJobsModule {}
