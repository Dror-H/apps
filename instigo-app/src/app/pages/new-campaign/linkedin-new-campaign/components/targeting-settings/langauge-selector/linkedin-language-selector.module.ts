import { NgModule } from '@angular/core';
import { LinkedinLanguageSelectorComponent } from './linkedin-language-selector.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LinkedinLanguageSelectorComponent],
  imports: [NzGridModule, NzFormModule, UiSharedModule, NzSelectModule, FormsModule],
  exports: [LinkedinLanguageSelectorComponent],
})
export class LinkedinLanguageSelectorModule {}
