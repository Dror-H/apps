import { NgModule } from '@angular/core';
import { CampaignSearchComponent } from './campaign-search.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CampaignSearchComponent],
  exports: [CampaignSearchComponent],
  imports: [NzIconModule, NzSelectModule, FormsModule, CommonModule],
})
export class CampaignSearchModule {}
