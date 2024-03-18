import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActionBoxModule } from '@audience-app/shared/components/action-box/action-box.module';
import { ActionButtonsModule } from '@audience-app/shared/components/action-buttons/action-buttons.module';
import { AdAccountSelectorContainerModule } from '@audience-app/shared/components/ad-account-selector-container/ad-account-selector-container.module';
import { AudienceDetailsOverviewModule } from '@audience-app/shared/components/audience-details-overview/audience-details-overview.module';
import { SharedPipesModule } from '@audience-app/shared/pipes/shared-pipes.module';
import { AudienceSegmentModule } from './components/audience-segment/audience-segment.module';
import { AudienceDetailsUserTagsModule } from './components/audience-details-user-tags/audience-details-user-tags.module';

const componentModules = [
  ActionButtonsModule,
  ActionBoxModule,
  AdAccountSelectorContainerModule,
  AudienceDetailsOverviewModule,
  AudienceSegmentModule,
  AudienceDetailsUserTagsModule,
];

@NgModule({
  imports: [CommonModule, SharedPipesModule, ...componentModules],
  exports: [SharedPipesModule, ...componentModules],
})
export class SharedModule {}
