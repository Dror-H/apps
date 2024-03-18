import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { VectorMapComponent } from './vector-map.component';

@NgModule({
  declarations: [VectorMapComponent],
  imports: [
    CommonModule,
    NzGridModule,
    NzTableModule,
    NzCardModule,
    NzSpinModule,
    GoogleChartsModule.forRoot({ mapsApiKey: 'AIzaSyCXdIDnJK24bCqOlywp0WpXYHJ7F-LPOqA' }),
  ],
  exports: [VectorMapComponent],
  providers: [],
})
export class VectorMapModule {}
