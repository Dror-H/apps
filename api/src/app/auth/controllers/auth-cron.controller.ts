import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Resources, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Inject, Post } from '@nestjs/common';
import { InspectUserTokenService } from '../services/inspect-user-token.service';

@CompositionDecorator({ resource: Resources.CRON_JOBS, useGuards: false })
export class AuthCronJobController {
  @Inject(InspectUserTokenService)
  private readonly inspectUserTokenService: InspectUserTokenService;

  @Post('refresh_tokens')
  refreshTokens(): any {
    void this.inspectUserTokenService.refreshTokens().then();
    return new ResponseSuccess('JOB STARTED');
  }

  @Post('inspect_tokens')
  inspectUserToken(): any {
    void this.inspectUserTokenService.inspectUserToken().then();
    return new ResponseSuccess('JOB STARTED');
  }
}
