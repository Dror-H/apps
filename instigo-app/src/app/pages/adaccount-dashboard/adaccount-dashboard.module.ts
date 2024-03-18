import { NgModule } from '@angular/core';
import { AdAccountDashboardRoutingModule } from './adaccount-dashboard-routing.module';
import { AdAccountDashboardComponentModule } from './components/adaccount-dashboard-component.module';

@NgModule({
  imports: [AdAccountDashboardRoutingModule, AdAccountDashboardComponentModule],
})
export class AdAccountDashboardModule {}
