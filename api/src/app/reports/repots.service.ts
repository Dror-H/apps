import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import {
  AdAccountDTO,
  MessagePatternCommandNames,
  ReportType,
  ResponseSuccess,
  TimeRange,
  User,
} from '@instigo-app/data-transfer-object';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs/operators';

@Injectable()
export class ReportsService {
  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  constructor(@Inject('REPORTS_MICRO') private readonly reportsMicroservice: ClientProxy) {}

  async createAdAccountReport(options: { adAccount: AdAccountDTO; timeRange: TimeRange; user: Partial<User> }) {
    const { timeRange, user } = options;
    let { adAccount } = options;
    adAccount = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
    const payload = {
      type: ReportType.AD_ACCOUNT,
      entity: adAccount,
      accessToken: adAccount.accessToken,
      timeRange,
      user,
    };
    return this.reportsMicroservice
      .emit<any>({ cmd: MessagePatternCommandNames.CREATE_REPORT }, payload)
      .pipe(map(() => new ResponseSuccess('Report generation started')));
  }
}
