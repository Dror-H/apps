import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CreateLeadFormModalComponent } from './create-lead-form-modal.component';

@NgModule({
  declarations: [CreateLeadFormModalComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
  ],
  exports: [CreateLeadFormModalComponent],
})
export class CreateLeadFormModalModule {}
