import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NoAdAccountRoutingModule } from './no-adaccount-routing.module';
import { NoAdAccountComponentComponent } from './no-adaccount.component';

@NgModule({
  declarations: [NoAdAccountComponentComponent],
  imports: [NzEmptyModule, NzGridModule, NzButtonModule, NoAdAccountRoutingModule, NzResultModule],
  exports: [NoAdAccountComponentComponent],
})
export class NoAdAccountModule {}
