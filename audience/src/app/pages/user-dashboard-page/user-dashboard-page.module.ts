import { NzAffixModule } from 'ng-zorro-antd/affix';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileContainerModule } from '@audience-app/pages/user-dashboard-page/profile-container/profile-container.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { UserDashboardPageRoutingModule } from './user-dashboard-page-routing.module';
import { UserDashboardPageComponent } from './user-dashboard-page.component';
import { UserSubscriptionContainerModule } from './user-subscription-container/user-subscription-container.module';

@NgModule({
  declarations: [UserDashboardPageComponent],
  imports: [
    CommonModule,
    UiSharedModule,
    UserDashboardPageRoutingModule,
    UserSubscriptionContainerModule,
    ProfileContainerModule,
    NzGridModule,
    NzAffixModule,
  ],
})
export class UserDashboardPageModule {}
