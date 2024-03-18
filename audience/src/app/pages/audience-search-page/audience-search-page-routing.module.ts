import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AudienceSearchPageComponent } from './audience-search-page.component';

const routes: Routes = [{ path: '', component: AudienceSearchPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienceSearchPageRoutingModule {}
