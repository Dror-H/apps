import { NgModule } from '@angular/core';
import { AdTemplateEditpageComponent } from './ad-template-editpage.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { UiLinkedinModule } from '@instigo-app/ui/linkedin';

@NgModule({
  declarations: [AdTemplateEditpageComponent],
  providers: [AdTemplateEditpageComponent],
  imports: [NzGridModule, CommonModule, UiSharedModule, UiFacebookModule, UiLinkedinModule, NzCardModule],
  exports: [AdTemplateEditpageComponent],
})
export class AdTemplateEditpageModule {}
