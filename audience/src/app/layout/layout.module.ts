import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { HeaderModule } from './header/header.module';
import { LayoutComponent } from './layout.component';
@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, NzLayoutModule, NzModalModule, HeaderModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
