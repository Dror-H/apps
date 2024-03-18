import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SelectExistingPostComponent } from './select-existing-post.component';
import { SelectFacebookPagePostModule } from './select-facebook-page-post/select-facebook-page-post.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { PostTypeSelectorModule } from '../post-type-selector/post-type-selector.module';

@NgModule({
  declarations: [SelectExistingPostComponent],
  imports: [
    CommonModule,
    PostTypeSelectorModule,
    SelectFacebookPagePostModule,
    NzCardModule,
    NzButtonModule,
    NzBadgeModule,
    NzToolTipModule,
    NzModalModule,
    NzCollapseModule,
    NzFormModule,
  ],
  exports: [SelectExistingPostComponent],
})
export class SelectExistingPostModule {}
