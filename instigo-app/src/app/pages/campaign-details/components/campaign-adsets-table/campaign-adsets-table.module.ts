import { NgModule } from '@angular/core';
import { CampaignAdsetsTableComponent } from './campaign-adsets-table.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxCurrencyModule } from 'ngx-currency';
import { AdTemplateOperationModule } from '@app/features/ad-template-operation/ad-template-operation.module';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [CampaignAdsetsTableComponent],
  exports: [CampaignAdsetsTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NgBooleanPipesModule,
    AdTemplateOperationModule,
    NzSwitchModule,
    NzSkeletonModule,
    NzToolTipModule,
    NzPopoverModule,
    NzTableModule,
    NzCardModule,
    NzButtonModule,
    NgxCurrencyModule,
    NzInputModule,
    NzFormModule,
    UiSharedModule,
  ],
})
export class CampaignAdsetsTableModule {}
