import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@audience-app/layout/layout.component';
import { PagesModule } from '@audience-app/pages/pages.module';
import { AuthResolve } from './auth/auth.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: [AuthResolve],
    component: LayoutComponent,
    loadChildren: (): Promise<PagesModule> => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
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
