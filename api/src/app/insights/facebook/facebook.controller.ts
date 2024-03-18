import { ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FacebookInsightsCrawlerService } from './facebook-insights-crawler.service';

@Controller('facebook/jobs')
@ApiTags('cron_jobs')
export class FacebookJobsController {
  @Inject(FacebookInsightsCrawlerService)
  private facebookInsightsCrawlerService: FacebookInsightsCrawlerService;

  @Post('sync-accounts')
  syncAdAccounts(@Body() body: { id: string }) {
    void this.facebookInsightsCrawlerService.sync({ cronicleJob: body });
    return new ResponseSuccess('JOB sync-accounts STARTED');
  }
}
