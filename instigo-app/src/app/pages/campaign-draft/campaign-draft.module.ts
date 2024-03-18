import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CampaignDraftRoutingModule } from '@app/pages/campaign-draft/campaign-draft-routing.module';
import { CampaignDraftComponent } from '@app/pages/campaign-draft/campaign-draft.component';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { FilterModule } from '@app/shared/filters/filter.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [CampaignDraftComponent],
  imports: [
    CommonModule,
    CampaignDraftRoutingModule,
    DataTableModule,
    UiSharedModule,
    FilterModule,
    TranslateModule,
    NzGridModule,
    NzPageHeaderModule,
    NzCardModule,
    NzToolTipModule,
    NzAlertModule,
    NzTabsModule,
  ],
})
export class CampaignDraftModule {}
