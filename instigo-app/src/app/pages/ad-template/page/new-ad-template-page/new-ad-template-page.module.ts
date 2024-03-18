import { NgModule } from '@angular/core';
import { NewAdTemplatePageComponent } from './new-ad-template-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NewAdTemplateCreateModule } from '@app/features/ad-template-operation/modules/ad-template-create-page/new-ad-template-create.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AdTemplateEditpageModule } from '@app/features/ad-template-operation/modules/ad-template-editpage/ad-template-editpage.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [NewAdTemplatePageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NewAdTemplateCreateModule,
    NzDividerModule,
    AdTemplateEditpageModule,
    NzGridModule,
    NzButtonModule,
    NzPageHeaderModule,
    NzFormModule,
    NzAlertModule,
  ],
  exports: [NewAdTemplatePageComponent],
})
export class NewAdTemplatePageModule {}
