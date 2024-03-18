import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KeywordsSuggestionsComponent } from '@audience-app/pages/audience-search-page/components/audience-search-input/keywords-suggestions/keywords-suggestions.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@NgModule({
  declarations: [KeywordsSuggestionsComponent],
  imports: [CommonModule, NzTagModule, NzTypographyModule, NzSkeletonModule],
  exports: [KeywordsSuggestionsComponent],
})
export class KeywordsSuggestionsModule {}
