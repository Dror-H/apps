import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAdAccountComponentComponent } from './no-adaccount.component';

const routes: Routes = [{ path: '', component: NoAdAccountComponentComponent, data: { title: 'No Accounts Found' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoAdAccountRoutingModule {}
