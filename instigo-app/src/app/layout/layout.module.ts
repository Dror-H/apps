import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { LayoutComponent } from './layout.component';
import { SideNavModule } from '@app/layout/side-nav/side-nav.module';
import { QuickNavModule } from '@app/layout/quick-nav/quick-nav.module';
import { HeaderModule } from '@app/layout/header/header.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { BannerComponent } from './banner/banner.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [LayoutComponent, BannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuickNavModule,
    HeaderModule,
    SideNavModule,
    NzLayoutModule,
    NzDropDownModule,
    RouterModule,
    NzRadioModule,
    NzAlertModule,
    NzNotificationModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
