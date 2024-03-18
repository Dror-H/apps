import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { IconsProviderModule } from '../../icons-provider.module';
import { NoAdAccountModule } from '../no-adaccount/no-adaccount.module';
import { WorkspaceDashboardRoutingModule } from './workspace-dashboard-routing.module';
import { WorkspaceDashboardComponent } from './workspace-dashboard.component';
import { WorkspaceDashboardService } from './workspace-dashboard.service';
import { WorkspaceWidgetsModule } from './workspace-widgets/workspace-widgets.module';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [WorkspaceDashboardComponent],
  imports: [
    CommonModule,
    WorkspaceDashboardRoutingModule,
    WorkspaceWidgetsModule,
    IconsProviderModule,
    UiSharedModule,
    NzToolTipModule,
    NzButtonModule,
    NzTabsModule,
    NzGridModule,
    NzPageHeaderModule,
    NzCardModule,
    NzAvatarModule,
    NoAdAccountModule,
  ],
  providers: [WorkspaceDashboardService],
})
export class WorkspaceDashboardModule {}
