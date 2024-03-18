import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FilterModule } from '../../../../shared/filters/filter.module';
import { AudienceDetailsModule } from '../../components/audience-details/audience-details.module';
import { AudiencesViewModule } from '../../components/audiences-view/audiences-view.module';
import { TargetingsViewModule } from '../../components/targetings-view/targetings-view.module';
import { AudiencesPageRoutingModule } from './audiences-page-routing.module';
import { AudiencesPageComponent } from './audiences-page.component';

@NgModule({
  declarations: [AudiencesPageComponent],
  imports: [
    FilterModule,
    NzModalModule,
    CommonModule,
    AudiencesPageRoutingModule,
    AudienceDetailsModule,
    AudiencesViewModule,
    TargetingsViewModule,
    NzGridModule,
    NzPageHeaderModule,
    NzTabsModule,
    NzButtonModule,
    NzDrawerModule,
  ],
})
export class AudiencesPageModule {}
