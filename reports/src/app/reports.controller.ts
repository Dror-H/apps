import { MessagePatternCommandNames, ReportType, TimeRange, User } from '@instigo-app/data-transfer-object';
import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AdAccountOverviewService } from './ad-account-overview.service';

@Controller()
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  @Inject(AdAccountOverviewService)
  private readonly adAccountOverviewService: AdAccountOverviewService;

  @EventPattern({ cmd: MessagePatternCommandNames.CREATE_REPORT })
  async createReport(
    @Payload()
    data: {
      type: string;
      entity: any;
      accessToken: string;
      timeRange: TimeRange;
      user: Partial<User>;
    },
  ) {
    const { type, entity, accessToken, timeRange, user } = data;
    this.logger.log([`Reports service started to build an report of entity`]);
    if (type === ReportType.AD_ACCOUNT) {
      return this.adAccountOverviewService.createAdAccountReport({
        accessToken,
        adAccount: entity,
        timeRange,
        user,
      });
    }
  }
}
