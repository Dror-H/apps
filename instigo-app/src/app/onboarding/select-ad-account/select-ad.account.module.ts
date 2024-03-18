import { NgModule } from '@angular/core';
import { SelectAdAccountComponent } from './select-ad-account.component';
import { RouterModule } from '@angular/router';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [SelectAdAccountComponent],
  imports: [RouterModule, NzToolTipModule],
  exports: [SelectAdAccountComponent],
})
export class SelectAdAccountModule {}
