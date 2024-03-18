import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIsLoggedInGuard } from '@audience-app/auth/guards/user-is-logged-in-can-load/user-is-logged-in.guard';
import { MergedAudienceResolver } from '@audience-app/pages/merged-audience-resolver/merged-audience.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'audience-search',
    pathMatch: 'full',
  },
  {
    path: 'audience-search',
    loadChildren: () =>
      import('./audience-search-page/audience-search-page.module').then((m) => m.AudienceSearchPageModule),
  },
  {
    path: 'audience-edit',
    loadChildren: () => import('./audience-edit-page/audience-edit-page.module').then((m) => m.AudienceEditPageModule),
    canLoad: [UserIsLoggedInGuard],
    resolve: [MergedAudienceResolver],
  },
  {
    path: 'user-dashboard',
    loadChildren: () =>
      import('./user-dashboard-page/user-dashboard-page.module').then((m) => m.UserDashboardPageModule),
    canLoad: [UserIsLoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
