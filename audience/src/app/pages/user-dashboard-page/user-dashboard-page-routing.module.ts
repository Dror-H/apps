import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardPageComponent } from './user-dashboard-page.component';
import { InvoicesComponent } from '@instigo-app/ui/shared';
import { UserSubscriptionContainerComponent } from './user-subscription-container/user-subscription-container.component';
import { ProfileContainerComponent } from '@audience-app/pages/user-dashboard-page/profile-container/profile-container.component';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardPageComponent,
    children: [
      { path: '', component: ProfileContainerComponent },
      { path: 'subscription', component: UserSubscriptionContainerComponent },
      { path: 'invoices', component: InvoicesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDashboardPageRoutingModule {}
