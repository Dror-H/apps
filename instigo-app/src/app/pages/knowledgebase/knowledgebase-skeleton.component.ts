import { Component } from '@angular/core';

@Component({
  selector: 'ingo-knowledgebase-skeleton',
  template: `
    <div nz-row [nzGutter]="25">
      <div nz-col nzSpan="24">
        <nz-page-header class="site-page-header">
          <nz-page-header-title>Knowledgebase</nz-page-header-title>
        </nz-page-header>
      </div>
    </div>
    <!-- Main Content -->
    <div nz-row [nzGutter]="24">
      <div nz-col [nzXXl]="6" [nzLg]="8" [nzMd]="10" [nzXs]="24">
        <nz-card class="ingo-card-nbm" nzTitle="Browse by Topic">
          <nz-skeleton
            [nzParagraph]="{ rows: 8 }"
            [nzTitle]="false"
            style="margin-bottom: 20px;"
            width="80%"
          ></nz-skeleton>
        </nz-card>
        <nz-card class="ingo-card-nbm ingo-card-banner" nzTitle="">
          <figure>
            <nz-skeleton-element nzType="image"></nz-skeleton-element>
          </figure>
          <figcaption>
            <nz-skeleton [nzParagraph]="{ rows: 1 }"></nz-skeleton>
            <nz-skeleton-element nzType="button" style="margin-top: 20px;"></nz-skeleton-element>
          </figcaption>
        </nz-card>
      </div>
      <div nz-col [nzXXl]="18" [nzLg]="16" [nzMd]="14" [nzXs]="24">
        <ng-container>
          <nz-card class="ingo-card-nbm" [nzTitle]="cardHead">
            <nz-collapse
              [nzGhost]="true"
              [nzBordered]="false"
              [nzExpandIconPosition]="'right'"
              class="ingo-primary-collapse"
            >
              <nz-collapse-panel [nzHeader]="itemHeader" *ngFor="let i of [].constructor(20)">
                <nz-skeleton [nzParagraph]="{ rows: 1 }"></nz-skeleton>
              </nz-collapse-panel>
            </nz-collapse>
          </nz-card>
        </ng-container>
      </div>
    </div>
    <ng-template #itemHeader><nz-skeleton [nzParagraph]="{ rows: 1 }"></nz-skeleton></ng-template>
    <ng-template #cardHead><nz-skeleton [nzParagraph]="{ rows: 1 }"></nz-skeleton></ng-template>
  `,
})
export class KnowledgebaseSkeletonComponent {
  constructor() {}

  ngOnInit() {}
}
