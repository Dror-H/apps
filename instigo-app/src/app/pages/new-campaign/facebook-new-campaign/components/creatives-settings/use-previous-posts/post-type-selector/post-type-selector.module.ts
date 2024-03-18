import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PostTypeSelectorComponent } from '@app/pages/new-campaign/facebook-new-campaign/components/creatives-settings/use-previous-posts/post-type-selector/post-type-selector.component';

@NgModule({
  declarations: [PostTypeSelectorComponent],
  exports: [PostTypeSelectorComponent],
  imports: [ReactiveFormsModule, NzFormModule, NzButtonModule, CommonModule, NzBadgeModule, NzToolTipModule],
})
export class PostTypeSelectorModule {}
