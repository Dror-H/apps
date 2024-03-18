import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { VectorMapModule } from '../../widgets/vector-map/vector-map.module';
import { VectorMapTableComponent } from './vector-map-table.component';

@NgModule({
  declarations: [VectorMapTableComponent],
  imports: [
    CommonModule,
    VectorMapModule,
    NzGridModule,
    NzTableModule,
    NzCardModule,
    NzDividerModule,
    NzMenuModule,
    NzDropDownModule,
    NzSpinModule,
  ],
  exports: [VectorMapTableComponent],
  providers: [],
})
export class VectorMapTableModule {}
