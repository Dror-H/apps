import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AudienceOverviewModule } from '@app/features/audience-creation/components/audience-overview/audience-overview.module';
import { AudienceTargetingModule } from '@app/features/audience-creation/components/audience-targeting/audience-targeting.module';
import { AudienceTypeSelectorModule } from '@app/features/audience-creation/components/audience-type-selector/audience-type-selector.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NewAudienceRoutingModule } from './new-audience-routing.module';
import { NewAudienceComponent } from './new-audience/new-audience.component';

@NgModule({
  declarations: [NewAudienceComponent],
  imports: [
    CommonModule,
    NewAudienceRoutingModule,
    AudienceTypeSelectorModule,
    AudienceTargetingModule,
    AudienceOverviewModule,
    UiSharedModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzGridModule,
    NzStepsModule,
    NzPageHeaderModule,
    NzCollapseModule,
    NzAlertModule,
    NzCardModule,
  ],
})
export class NewAudienceModule {}
