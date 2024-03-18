import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AccountDeletionModule } from './account-deletion/account-deletion.module';
import { AccountSecurityRoutingModule } from './account-security-routing.module';
import { AccountSecurityComponent } from './account-security.component';

@NgModule({
  declarations: [AccountSecurityComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountSecurityRoutingModule,
    NzGridModule,
    NzCardModule,
    NzFormModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzToolTipModule,
    NzEmptyModule,
    NzSkeletonModule,
    TranslateModule,
    AccountDeletionModule,
  ],
  providers: [],
})
export class AccountSecurityModule {}
