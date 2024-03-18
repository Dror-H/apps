import { ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LinkedinInsightsCrawlerService } from './linkedin-insights-crawler.service';

@Controller('linkedin/jobs')
@ApiTags('cron_jobs')
export class LinkedinJobsController {
  @Inject(LinkedinInsightsCrawlerService)
  private LinkedinInsightsCrawlerService: LinkedinInsightsCrawlerService;

  @Post('sync-accounts')
  syncAdAccounts(@Body() body: { id: string }) {
    void this.LinkedinInsightsCrawlerService.syncAdAccounts({ cronicleJob: body });
    return new ResponseSuccess('JOB sync-accounts STARTED');
  }
}
