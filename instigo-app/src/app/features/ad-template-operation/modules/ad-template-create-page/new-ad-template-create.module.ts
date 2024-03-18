import { NgModule } from '@angular/core';
import { NewAdTemplateCreateComponent } from './new-ad-template-create.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NewAdTemplateHeaderModule } from '../ad-template-header/new-ad-template-header.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [NewAdTemplateCreateComponent],
  exports: [NewAdTemplateCreateComponent],
  imports: [
    NzPageHeaderModule,
    NewAdTemplateHeaderModule,
    ReactiveFormsModule,
    UiSharedModule,
    CommonModule,
    NzGridModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzRadioModule,
    NzFormModule,
  ],
})
export class NewAdTemplateCreateModule {}
