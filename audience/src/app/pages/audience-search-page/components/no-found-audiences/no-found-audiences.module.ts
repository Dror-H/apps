import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoFoundAudiencesComponent } from '@audience-app/pages/audience-search-page/components/no-found-audiences/no-found-audiences.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
  declarations: [NoFoundAudiencesComponent],
  imports: [CommonModule, NzTypographyModule],
  exports: [NoFoundAudiencesComponent],
})
export class NoFoundAudiencesModule {}
