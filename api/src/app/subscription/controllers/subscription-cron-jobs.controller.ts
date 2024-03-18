import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Resources, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Get, Inject } from '@nestjs/common';
import { SubscriptionCronJobService } from '../services/subscription-cron-jobs.service';

@CompositionDecorator({ resource: Resources.CRON_JOBS, useGuards: false })
export class SubscriptionCronJobsController {
  @Inject(SubscriptionCronJobService)
  private readonly subscriptionCronJobService: SubscriptionCronJobService;

  @Get('activate_basic_plan_for_expired_trials')
  activateBasicPlanForExpiredTrials(): ResponseSuccess {
    void this.subscriptionCronJobService.activateBasicPlanForExpiredTrials();
    return new ResponseSuccess('JOB STARTED');
  }
}
