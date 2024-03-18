import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SelectExistingPostModule } from './select-existing-post/select-existing-post.module';
import { SelectedPostPreviewModule } from './select-existing-post/selected-post-preview/selected-post-preview.module';
import { UsePreviousPostsComponent } from './use-previous-posts.component';
import { UsePreviousPostsService } from './use-previous-posts.service';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { PostTypeSelectorModule } from './post-type-selector/post-type-selector.module';

@NgModule({
  declarations: [UsePreviousPostsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectExistingPostModule,
    PostTypeSelectorModule,
    SelectedPostPreviewModule,
    UiSharedModule,
    UiFacebookModule,
    NzButtonModule,
    NzDividerModule,
    NzModalModule,
    NzFormModule,
    NzToolTipModule,
    NzBadgeModule,
    NzRadioModule,
    NzCollapseModule,
  ],
  providers: [UsePreviousPostsService],
  exports: [UsePreviousPostsComponent],
})
export class UsePreviousPostsModule {}
