import { config } from '@instigo-app/api-shared';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService;
  @Get()
  root(): any {
    const { packageBody } = config();
    return { version: packageBody.version, visit: 'https://instigo.io/', service: 'cron-worker' };
  }

  @Post()
  triggerJob(@Body() body: { key: string }): string {
    return this.appService.triggerJob(body.key);
  }
}
