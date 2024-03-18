import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserApiService } from '@audience-app/api/user-api/user-api.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { DISPLAY_NOTIFICATION_SERVICE, UiSharedModule, USER_API_SERVICE } from '@instigo-app/ui/shared';
import { ProfileContainerRoutingModule } from './profile-container-routing.module';
import { ProfileContainerComponent } from './profile-container.component';

@NgModule({
  declarations: [ProfileContainerComponent],
  imports: [CommonModule, ProfileContainerRoutingModule, UiSharedModule],
  providers: [
    { provide: USER_API_SERVICE, useExisting: UserApiService },
    { provide: DISPLAY_NOTIFICATION_SERVICE, useExisting: DisplayNotificationService },
  ],
})
export class ProfileContainerModule {}
