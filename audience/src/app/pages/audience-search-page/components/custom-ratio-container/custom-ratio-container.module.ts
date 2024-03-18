import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomRatioModule } from '@audience-app/pages/audience-search-page/components/custom-ratio/custom-ratio.module';
import { CustomRatioContainerComponent } from '@audience-app/pages/audience-search-page/components/custom-ratio-container/custom-ratio-container.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [CustomRatioContainerComponent],
  imports: [CommonModule, FormsModule, NzSwitchModule, CustomRatioModule],
  exports: [CustomRatioContainerComponent],
})
export class CustomRatioContainerModule {}
