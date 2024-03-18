import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudienceSearchInputComponent } from '@audience-app/pages/audience-search-page/components/audience-search-input/audience-search-input.component';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { HistoryService } from './history.service';
import { SuggestionsService } from '@audience-app/pages/audience-search-page/components/audience-search-input/suggestions.service';
import { KeywordsSuggestionsModule } from '@audience-app/pages/audience-search-page/components/audience-search-input/keywords-suggestions/keywords-suggestions.module';

@NgModule({
  declarations: [AudienceSearchInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    NzGridModule,
    NzSpinModule,
    NzTagModule,
    NzIconModule,
    NzSelectModule,
    NzButtonModule,
    NzTypographyModule,
    UiSharedModule,
    KeywordsSuggestionsModule,
  ],
  providers: [HistoryService, SuggestionsService],
  exports: [AudienceSearchInputComponent],
})
export class AudienceSearchInputModule {}
