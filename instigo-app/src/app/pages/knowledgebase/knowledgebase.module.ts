import { NgModule } from '@angular/core';
import { KnowledgebaseRoutingModule } from './knowledgebase-routing.module';
import { KnowledgebaseComponent } from './knowledgebase.component';
import { KnowledgebaseSkeletonComponent } from './knowledgebase-skeleton.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [KnowledgebaseComponent, KnowledgebaseSkeletonComponent],
  imports: [
    KnowledgebaseRoutingModule,
    FormsModule,
    HttpClientModule,
    NzGridModule,
    NzCollapseModule,
    NzPageHeaderModule,
    NzCardModule,
    NzSkeletonModule,
    CommonModule,
  ],
  providers: [],
})
export class KnowledgebaseModule {}
