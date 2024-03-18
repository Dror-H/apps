import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionPickerComponent } from './subscription-plan-picker/subscription-picker.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPickerComponent,
    data: { title: 'Subscription' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
