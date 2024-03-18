import { NgModule } from '@angular/core';
import { OverviewComponent } from './overview.component';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ChartsModule } from 'ng2-charts';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    UiSharedModule,
    NzCardModule,
    NzGridModule,
    NzSkeletonModule,
    NzInputNumberModule,
    NzDropDownModule,
  ],
  exports: [OverviewComponent],
})
export class OverviewModule {}
