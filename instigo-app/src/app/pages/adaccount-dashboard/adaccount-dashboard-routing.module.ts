import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdAccountDashboardComponent } from './components/adaccount-dashboard-component';

const routes: Routes = [{ path: '', component: AdAccountDashboardComponent, data: { title: 'Ad Account Dashboard' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdAccountDashboardRoutingModule {}
