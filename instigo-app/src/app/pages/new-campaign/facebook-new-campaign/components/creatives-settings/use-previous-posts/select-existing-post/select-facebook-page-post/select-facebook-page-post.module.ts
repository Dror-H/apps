import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SelectFacebookPagePostComponent } from './select-facebook-page-post.component';
import { SelectFacebookPagePostService } from './select-facebook-page-post.service';
import { UiFacebookModule } from '@instigo-app/ui/facebook';

@NgModule({
  declarations: [SelectFacebookPagePostComponent],
  imports: [
    CommonModule,
    DataTableModule,
    UiSharedModule,
    UiFacebookModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzToolTipModule,
    NzFormModule,
    NzGridModule,
  ],
  providers: [SelectFacebookPagePostService],
  exports: [SelectFacebookPagePostComponent],
})
export class SelectFacebookPagePostModule {}
