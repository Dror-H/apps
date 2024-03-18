import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdTemplateEditModalComponent } from './ad-template-edit-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AdTemplateEditpageModule } from '../ad-template-editpage/ad-template-editpage.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [AdTemplateEditModalComponent],
  imports: [CommonModule, AdTemplateEditpageModule, UiSharedModule, NzButtonModule, NzModalModule, NzFormModule],
  exports: [AdTemplateEditModalComponent],
})
export class AdTemplateEditModalModule {}
