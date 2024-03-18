import { NgModule } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CampaignResultComponent } from './campaign-result.component';

@NgModule({
  declarations: [CampaignResultComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    NzResultModule,
    NzTypographyModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
  ],
  exports: [CampaignResultComponent],
})
export class CampaignResultModule {}
