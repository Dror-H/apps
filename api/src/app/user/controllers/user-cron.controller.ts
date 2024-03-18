import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Resources, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Inject, Post } from '@nestjs/common';
import { InspectUserAccountService } from '../services/inspect-user-account-status.service';
import { InspectUserCostCapService } from '../services/inspect-user-cost-cap.service';
import { UserSlackReportsService } from '../services/user-slack-reports.service';

@CompositionDecorator({ resource: Resources.CRON_JOBS, useGuards: false })
export class UserCronJobsController {
  @Inject(InspectUserAccountService)
  private readonly inspectUserAccountService: InspectUserAccountService;

  @Inject(InspectUserCostCapService)
  private readonly inspectUserCostCapService: InspectUserCostCapService;

  @Inject(UserSlackReportsService)
  private readonly userSlackReportsService: UserSlackReportsService;

  @Post('inspect_user_account')
  public inspectUserAccountStatus() {
    void this.inspectUserAccountService.inspectUsersAccountStatus().then();
    return new ResponseSuccess('JOB STARTED');
  }

  @Post('check_account_cost_cap')
  public inspectUserCostCap() {
    void this.inspectUserCostCapService.inspectCostCap().then();
    return new ResponseSuccess('JOB STARTED');
  }

  @Post('report_users')
  public reportUsers() {
    void this.userSlackReportsService.reportOnSlack().then();
    return new ResponseSuccess('JOB STARTED');
  }
}
