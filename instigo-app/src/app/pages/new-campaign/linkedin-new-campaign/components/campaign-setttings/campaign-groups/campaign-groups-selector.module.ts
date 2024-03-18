import { CampaignGroupsSelectorComponent } from './campaign-groups-selector.component';
import { NgModule } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CampaignGroupsSelectorComponent],
  imports: [UiSharedModule, NzSelectModule, NzFormModule, ReactiveFormsModule, CommonModule],
  exports: [CampaignGroupsSelectorComponent],
})
export class CampaignGroupsSelectorModule {}
