import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared/shared.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Ng5SliderModule } from 'ng5-slider';
import { FacebookLookalikeAudienceComponent } from './facebook-lookalike-audience.component';

@NgModule({
  declarations: [FacebookLookalikeAudienceComponent],
  imports: [
    ScrollingModule,
    CommonModule,
    FormsModule,
    UiSharedModule,
    Ng5SliderModule,
    NzGridModule,
    NzSelectModule,
    NzToolTipModule,
    NzInputModule,
    SharedModule,
    NzButtonModule,
    NzFormModule,
  ],
  exports: [FacebookLookalikeAudienceComponent],
  providers: [],
})
export class FacebookLookalikeAudienceModule {}
