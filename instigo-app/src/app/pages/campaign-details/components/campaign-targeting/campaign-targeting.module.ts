import { NgModule } from '@angular/core';
import { CampaignTargetingComponent } from './campaign-targeting.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NgBooleanPipesModule } from 'ngx-pipes';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CampaignTargetingEditModule } from '@app/pages/campaign-details/components/campaign-targeting/campaign-targeting-edit-modal/campaign-targeting-edit.module';
import { QuickActionsService } from '@app/pages/campaigns/quick-actions.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CampaignsViewService } from '@app/pages/campaigns/campaigns-view.service';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [CampaignTargetingComponent],
  imports: [
    CommonModule,
    CampaignTargetingEditModule,
    UiSharedModule,
    NzGridModule,
    NzCardModule,
    NzDescriptionsModule,
    NgBooleanPipesModule,
    NzPopoverModule,
    NzListModule,
    NzTypographyModule,
    NzSkeletonModule,
    NzToolTipModule,
    TranslateModule,
    NzTabsModule,
    NzCarouselModule,
    NzCollapseModule,
    NzButtonModule,
    NzModalModule,
  ],
  exports: [CampaignTargetingComponent],
  providers: [CampaignsViewService, QuickActionsService],
})
export class CampaignTargetingModule {}
