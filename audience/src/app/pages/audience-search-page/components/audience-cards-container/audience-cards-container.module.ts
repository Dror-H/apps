import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AudienceCardSkeletonModule } from '@audience-app/pages/audience-search-page/components/audience-card-skeleton/audience-card-skeleton.module';
import { AudienceCardModule } from '@audience-app/pages/audience-search-page/components/audience-card/audience-card.module';
import { AudienceCardsContainerComponent } from '@audience-app/pages/audience-search-page/components/audience-cards-container/audience-cards-container.component';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [AudienceCardsContainerComponent],
  imports: [
    CommonModule,
    NzGridModule,
    NzButtonModule,
    NzToolTipModule,
    AudienceCardModule,
    AudienceCardSkeletonModule,
    UiSharedModule,
  ],
  exports: [AudienceCardsContainerComponent],
})
export class AudienceCardsContainerModule {}
