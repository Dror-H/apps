import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionGuard } from './global/subscription.guard';
import { LayoutComponent } from './layout/layout.component';
import { PagesResolver } from './pages/pages.resolver';
import { AuthGuard } from './security/auth.guard';
import { NoWorkspaceGuard } from './security/no-workspace.guard';
import { OnboardingGuard } from './security/onboarding.guard';
import { RedirectService } from './security/redirect.service';
import { SetJwtService } from './security/setJwt.service';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard, OnboardingGuard, NoWorkspaceGuard],
    runGuardsAndResolvers: 'always',
    resolve: { state: PagesResolver },
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  { path: 'token/:token', component: LayoutComponent, canActivate: [SetJwtService, RedirectService] },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then((m) => m.OnboardingModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'ad-template-operation',
    canActivate: [SubscriptionGuard],
    loadChildren: () =>
      import('./features/ad-template-operation/ad-template-operation.module').then((m) => m.AdTemplateOperationModule),
    outlet: 'dialog',
  },
  {
    path: 'audience-operation',
    canActivate: [SubscriptionGuard],
    loadChildren: () =>
      import('./features/audience-operation/audience-operation.module').then((m) => m.AudienceOperationModule),
    outlet: 'dialog',
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      useHash: false,
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
