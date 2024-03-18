import { NgModule } from '@angular/core';
import { LinkedinCreativeVariationsOverviewComponent } from './linkedin-creative-variations-overview.component';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [LinkedinCreativeVariationsOverviewComponent],
  imports: [UiSharedModule, NzCardModule],
  exports: [LinkedinCreativeVariationsOverviewComponent],
})
export class LinkedinCreativeVariationsOverviewModule {}
