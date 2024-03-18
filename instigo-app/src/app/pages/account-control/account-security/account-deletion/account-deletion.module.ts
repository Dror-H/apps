import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AccountDeletionComponent } from './account-deletion.component';

@NgModule({
  declarations: [AccountDeletionComponent],
  imports: [CommonModule, FormsModule, NzCollapseModule, NzModalModule, NzButtonModule, NzCardModule],
  exports: [AccountDeletionComponent],
})
export class AccountDeletionModule {}
