import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CreateNewVariationsModule } from './create-new-variations/create-new-variations.module';
import { NCCreativesSettingsComponent } from './creatives-settings.component';
import { UseExistingTemplatesModule } from './use-existing-templates/use-existing-templates.module';
import { UsePreviousPostsModule } from './use-previous-posts/use-previous-posts.module';

@NgModule({
  declarations: [NCCreativesSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateNewVariationsModule,
    UseExistingTemplatesModule,
    UsePreviousPostsModule,
    NzButtonModule,
    NzCardModule,
    NzBadgeModule,
    NzToolTipModule,
    NzDividerModule,
    NzFormModule,
  ],
  exports: [NCCreativesSettingsComponent],
})
export class CreativesSettingsModule {}
