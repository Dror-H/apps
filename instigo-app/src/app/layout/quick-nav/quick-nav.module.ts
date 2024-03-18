import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { QuickNavComponent } from './quick-nav.component';

@NgModule({
  declarations: [QuickNavComponent],
  exports: [QuickNavComponent],
  imports: [
    CommonModule,
    NzAutocompleteModule,
    FormsModule,
    TranslateModule,
    NzInputModule,
    NzToolTipModule,
    NzIconModule,
    NzButtonModule,
  ],
})
export class QuickNavModule {}
