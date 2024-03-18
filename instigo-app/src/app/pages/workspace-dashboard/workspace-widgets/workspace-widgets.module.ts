import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CampaignDetailsService } from '@app/pages/campaign-details/campaign-details.service';
import { IconsProviderModule } from '@app/icons-provider.module';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { SharedModule } from '@app/shared/shared/shared.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { TranslateModule } from '@ngx-translate/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ChartsModule } from 'ng2-charts';
import { NgPipesModule } from 'ngx-pipes';
import { AdAccountsTableComponent } from './ad-accounts-table/ad-accounts-table.component';
import { CampaignsTableComponent } from './campaigns-table/campaigns-table.component';
import { InsightsCardsComponent } from './insights-cards/insights-cards.component';
import { MembersComponent } from './members/members.component';
import { ProviderBreakdownComponent } from './provider-breakdown/provider-breakdown.component';
import { ProviderInsightsComponent } from './provider-insights/provider-insights.component';
import { WorkspaceActivityComponent } from './workspace-activity/workspace-activity.component';
import { WorkspaceBudgetComponent } from './workspace-budget/workspace-budget.component';
import { WorkspaceOverviewComponent } from './workspace-overview/workspace-overview.component';
import { WorkspaceTrackersComponent } from './workspace-trackers/workspace-trackers.component';

@NgModule({
  declarations: [
    MembersComponent,
    AdAccountsTableComponent,
    InsightsCardsComponent,
    ProviderBreakdownComponent,
    WorkspaceBudgetComponent,
    CampaignsTableComponent,
    WorkspaceOverviewComponent,
    WorkspaceActivityComponent,
    WorkspaceTrackersComponent,
    ProviderInsightsComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    ChartsModule,
    NgPipesModule,
    UiSharedModule,
    IconsProviderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzInputModule,
    NzCardModule,
    NzCardModule,
    NzAvatarModule,
    NzToolTipModule,
    NzProgressModule,
    NzBadgeModule,
    NzTagModule,
    NzButtonModule,
    TranslateModule,
    NzGridModule,
    NzTableModule,
    NzCardModule,
    NzDividerModule,
    NzMenuModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzInputModule,
    NzToolTipModule,
    DataTableModule,
    NzToolTipModule,
    NzEmptyModule,
    NzSkeletonModule,
    NzInputNumberModule,
    NzProgressModule,
    NzSpinModule,
  ],
  exports: [
    MembersComponent,
    AdAccountsTableComponent,
    InsightsCardsComponent,
    ProviderBreakdownComponent,
    WorkspaceBudgetComponent,
    CampaignsTableComponent,
    WorkspaceOverviewComponent,
    WorkspaceActivityComponent,
    WorkspaceTrackersComponent,
    ProviderInsightsComponent,
  ],
  providers: [CampaignDetailsService],
})
export class WorkspaceWidgetsModule {}
