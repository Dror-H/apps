import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SelectExistingComponent } from './select-existing.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SelectExistingComponent],
  imports: [
    CommonModule,
    FormsModule,
    PerfectScrollbarModule,
    NzEmptyModule,
    NzModalModule,
    NzPaginationModule,
    NzGridModule,
    NzButtonModule,
    NzRadioModule,
    NzCardModule,
    NzFormModule,
  ],
  exports: [SelectExistingComponent],
})
export class SelectExistingModule {}
