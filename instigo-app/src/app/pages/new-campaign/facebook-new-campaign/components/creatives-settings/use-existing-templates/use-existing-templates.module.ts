import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ExistingTemplatePreviewModule } from './existing-template-preview/existing-template-preview.module';
import { UseExistingTemplateService } from './use-existing-template.service';
import { UseExistingTemplatesComponent } from './use-existing-templates.component';

@NgModule({
  declarations: [UseExistingTemplatesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExistingTemplatePreviewModule,
    UiSharedModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzToolTipModule,
    NzTableModule,
    NzPopoverModule,
    NzSelectModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzPaginationModule,
    NzDividerModule,
    NzModalModule,
  ],
  providers: [UseExistingTemplateService, DatePipe],
  exports: [UseExistingTemplatesComponent],
})
export class UseExistingTemplatesModule {}
