import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { AdAccountDTO, Resources, TimeRange, User } from '@instigo-app/data-transfer-object';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ReportsService } from './repots.service';

@Controller(Resources.REPORTS)
@CompositionDecorator({ resource: Resources.REPORTS })
export class ReportsController {
  @Inject(ReportsService) reportsService: ReportsService;

  @Post(Resources.AD_ACCOUNTS)
  createAdAccountReport(
    @Body() body: { adAccount: AdAccountDTO; timeRange: TimeRange },
    @CurrentUser() user: Partial<User>,
  ) {
    const { adAccount, timeRange } = body;
    return this.reportsService.createAdAccountReport({ adAccount, timeRange, user });
  }
}
