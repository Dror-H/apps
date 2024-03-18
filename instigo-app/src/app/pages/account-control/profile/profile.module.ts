import { NgModule } from '@angular/core';
import { UserApiService } from '@app/api/services/user.api.service';
import { DisplayNotification } from '@app/global/display-notification.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import {
  ANALYTICS_SERVICE,
  DISPLAY_NOTIFICATION_SERVICE,
  UiSharedModule,
  USER_API_SERVICE,
} from '@instigo-app/ui/shared';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [ProfileRoutingModule, UiSharedModule],
  providers: [
    { provide: USER_API_SERVICE, useExisting: UserApiService },
    { provide: DISPLAY_NOTIFICATION_SERVICE, useExisting: DisplayNotification },
    { provide: ANALYTICS_SERVICE, useExisting: AnalyticsService },
  ],
})
export class ProfileModule {}
