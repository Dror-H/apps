import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActionButtonsComponent } from '@audience-app/shared/components/action-buttons/action-buttons.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [ActionButtonsComponent],
  imports: [CommonModule, NzGridModule, NzButtonModule],
  exports: [ActionButtonsComponent],
})
export class ActionButtonsModule {}
