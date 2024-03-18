import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { DisplayNotification } from './display-notification.service';
import { SpinnerState } from './spinner.state';
import { SubscriptionGuard } from './subscription.guard';
import { UserState } from './user.state';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { WebsiteUserApiService } from '@app/api/services/website-user.api.service';

@NgModule({
  imports: [NgxsModule.forFeature([UserState, SpinnerState]), NzModalModule, NzNotificationModule],
  providers: [
    DisplayNotification,
    WebsiteUserApiService,
    SubscriptionGuard,
    { provide: 'LOGIN_PAGE', useValue: '/auth/login' },
    { provide: 'DASHBOARD', useValue: '/dashboard/adaccount' },
  ],
  exports: [],
})
export class GlobalModule {}
