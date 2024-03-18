import { NgModule } from '@angular/core';
import { AudienceTypeSelectorComponent } from './audience-type-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [AudienceTypeSelectorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NzCardModule,
    NzButtonModule,
    NzDividerModule,
    NzRadioModule,
    NzFormModule,
  ],
  exports: [AudienceTypeSelectorComponent],
})
export class AudienceTypeSelectorModule {}
