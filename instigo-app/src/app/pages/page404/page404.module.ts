import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Page404RoutingModule } from './page404-routing.component';
import { Page404Component } from './page404.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [Page404Component],
  imports: [CommonModule, TranslateModule, NzEmptyModule, NzGridModule, NzButtonModule, Page404RoutingModule],
  exports: [Page404Component],
})
export class Page404Module {}
