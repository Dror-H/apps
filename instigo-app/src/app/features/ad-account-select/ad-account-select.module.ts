import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { AdAccountSelectComponent } from './ad-account-select.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@NgModule({
  declarations: [AdAccountSelectComponent],
  imports: [CommonModule, FormsModule, NzModalModule, DataTableModule, NzButtonModule, NzInputModule, NzSkeletonModule],
  exports: [AdAccountSelectComponent],
})
export class AdAccountSelectModule {}
