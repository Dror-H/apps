import { NgModule } from '@angular/core';
import { CustomAudienceSelectorComponent } from './custom-audience-selector.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [CustomAudienceSelectorComponent],
  exports: [CustomAudienceSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzListModule,
    NzCardModule,
  ],
})
export class CustomAudienceSelectorModule {}
