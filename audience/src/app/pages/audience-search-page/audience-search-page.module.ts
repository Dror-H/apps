import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AudienceSearchPageRoutingModule } from '@audience-app/pages/audience-search-page/audience-search-page-routing.module';
import { AudienceSearchPageComponent } from '@audience-app/pages/audience-search-page/audience-search-page.component';
import { AudienceCardsContainerModule } from '@audience-app/pages/audience-search-page/components/audience-cards-container/audience-cards-container.module';
import { AudienceSearchInputModule } from '@audience-app/pages/audience-search-page/components/audience-search-input/audience-search-input.module';
import { CustomRatioContainerModule } from '@audience-app/pages/audience-search-page/components/custom-ratio-container/custom-ratio-container.module';
import { NoFoundAudiencesModule } from '@audience-app/pages/audience-search-page/components/no-found-audiences/no-found-audiences.module';
import { SharedModule } from '@audience-app/shared/shared.module';
import { AudienceDetailsDrawerState } from '@audience-app/store/audience-details-drawer.state';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NgxsModule } from '@ngxs/store';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AudienceDetailsDrawerModule } from './components/audience-details-drawer/audience-details-drawer.module';

@NgModule({
  declarations: [AudienceSearchPageComponent],
  imports: [
    CommonModule,
    AudienceSearchPageRoutingModule,

    // NG-ZORRO
    NzAffixModule,
    NzTypographyModule,
    NzGridModule,
    NzButtonModule,

    // NGXS
    NgxsModule.forFeature([AudiencesState, AudienceDetailsDrawerState]),

    // FEATURE Modules
    CustomRatioContainerModule,
    AudienceSearchInputModule,
    AudienceCardsContainerModule,
    AudienceDetailsDrawerModule,
    NoFoundAudiencesModule,
    SharedModule,
    UiSharedModule,
  ],
})
export class AudienceSearchPageModule {}
