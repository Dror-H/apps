import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SavedAudienceSelectorComponent } from './saved-audience-selector.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  declarations: [SavedAudienceSelectorComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzRadioModule,
  ],
  exports: [SavedAudienceSelectorComponent],
})
export class SavedAudienceSelectorModule {}
