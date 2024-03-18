import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Page500RoutingModule } from './page500-routing.component';
import { Page500Component } from './page500.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [Page500Component],
  imports: [CommonModule, TranslateModule, NzEmptyModule, NzGridModule, NzButtonModule, Page500RoutingModule],
  exports: [Page500Component],
})
export class Page500Module {}
