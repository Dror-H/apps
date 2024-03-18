import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceCardSkeletonComponent } from './audience-card-skeleton.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [AudienceCardSkeletonComponent],
  imports: [CommonModule, NzSkeletonModule, NzCardModule],
  exports: [AudienceCardSkeletonComponent],
})
export class AudienceCardSkeletonModule {}
