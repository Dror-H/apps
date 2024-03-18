import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomRatioComponent } from '@audience-app/pages/audience-search-page/components/custom-ratio/custom-ratio.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomRatioComponent],
  imports: [CommonModule, FormsModule, NzSliderModule, NzGridModule],
  exports: [CustomRatioComponent],
})
export class CustomRatioModule {}
