import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-filter-by-page',
  template: `
    <a
      nzTrigger="click"
      class="ingo-table-filter"
      nz-popover
      nzPopoverTrigger="click"
      nzPopoverPlacement="bottomRight"
      nzPopoverOverlayClassName="table-filter-list"
      [nzPopoverTitle]="colCustomizeTitle"
      [nzPopoverContent]="colCustomizeContent"
      >Page
      <div class="ingo-adaccount-dropdown-icon"></div
    ></a>
    <ng-template #colCustomizeTitle>
      <div class="table-filter-content-item" [ngClass]="{ active: allChecked, unknown: indeterminate }">
        <label nz-checkbox [(ngModel)]="allChecked" (ngModelChange)="toggleAll()" [nzIndeterminate]="indeterminate"
          >Select All</label
        >
      </div>
    </ng-template>
    <ng-template #colCustomizeContent>
      <div class="table-filter-content">
        <div nz-row nzGutter="10">
          <div nz-col nzSm="24" *ngFor="let page of clonedPages">
            <div class="table-filter-content-item" [ngClass]="{ active: page.checked }">
              <label
                id="page_{{ page.providerId }}"
                nz-checkbox
                [(ngModel)]="page.checked"
                (ngModelChange)="onChange()"
                [ngModelOptions]="{ standalone: true }"
              >
                {{ page.name.length > 20 ? (page.name | slice: 0:20) + '...' : page.name }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class FilterByPageComponent implements OnInit, OnChanges {
  @Input() pages: any[];

  public allChecked = true;
  public indeterminate = false;
  public clonedPages: any[];

  @Output() selectedPages = new EventEmitter<any[]>();

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.pages) {
      const { currentValue, previousValue }: SimpleChange = changes.pages;
      if (currentValue?.length && JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
        this.clonedPages = cloneDeep(currentValue);
      }
      if (currentValue?.length === 0) {
        this.clonedPages = [];
      }
    }
  }

  onChange() {
    if (this.clonedPages.every((val, ind, arr) => val.checked === arr[0].checked)) {
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.selectedPages.emit(this.clonedPages);
  }

  public toggleAll() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.clonedPages = this.pages.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.clonedPages = this.pages.map((item) => ({
        ...item,
        checked: false,
      }));
    }
    this.onChange();
  }
}
