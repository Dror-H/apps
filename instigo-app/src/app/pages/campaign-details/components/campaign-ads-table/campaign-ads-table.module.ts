import { NgModule } from '@angular/core';
import { CampaignAdsTableComponent } from './campaign-ads-table.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NgBooleanPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TranslateModule } from '@ngx-translate/core';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [CampaignAdsTableComponent],
  exports: [CampaignAdsTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NzSwitchModule,
    NgBooleanPipesModule,
    NzSkeletonModule,
    NzToolTipModule,
    NzPopoverModule,
    NzTableModule,
    NzCardModule,
    NzButtonModule,
    UiSharedModule,
  ],
})
export class CampaignAdsTableModule {}
