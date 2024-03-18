import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/security/auth.guard';
import { SetJwtService } from '@app/security/setJwt.service';

import { ClearStateService } from './clear-state.service';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { OnboardingPageGuard } from './onboardingPage.guard';
import { SelectAdAccountComponent } from './select-ad-account/select-ad-account.component';

const routes: Routes = [
  {
    path: 'invited-member/:token',
    canActivate: [ClearStateService, SetJwtService, AuthGuard, OnboardingPageGuard],
    component: OnboardingComponent,
    data: { title: 'Account Setup' },
  },
  {
    path: ':token',
    canActivate: [SetJwtService, AuthGuard, OnboardingPageGuard],
    component: OnboardingComponent,
    data: { title: 'Account Setup' },
  },
  {
    path: '',
    canActivate: [AuthGuard, OnboardingPageGuard],
    component: OnboardingComponent,
    data: { title: 'Account Setup' },
    children: [
      {
        path: 'select-ad-account/:provider',
        component: SelectAdAccountComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {}
