import { NgModule } from '@angular/core';
import { CreativeVariationsOverviewComponent } from './creative-variations-overview.component';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [CreativeVariationsOverviewComponent],
  imports: [CommonModule, NzGridModule, NzCardModule, NzDividerModule, UiSharedModule],
  exports: [CreativeVariationsOverviewComponent],
})
export class CreativeVariationsOverviewModule {}
