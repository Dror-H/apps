import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActionBoxComponent } from '@audience-app/shared/components/action-box/action-box.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [ActionBoxComponent],
  imports: [CommonModule, NzButtonModule],
  exports: [ActionBoxComponent],
})
export class ActionBoxModule {}
