import { UserHasSubscriptionGuard } from '@audience-app/auth/guards/user-has-subscription/user-has-subscription.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudienceEditPageComponent } from '@audience-app/pages/audience-edit-page/audience-edit-page.component';
import { PendingChangesGuard } from '@instigo-app/ui/shared';

const routes: Routes = [
  {
    path: '',
    component: AudienceEditPageComponent,
    canActivate: [UserHasSubscriptionGuard],
    canDeactivate: [PendingChangesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienceEditPageRoutingModule {}
