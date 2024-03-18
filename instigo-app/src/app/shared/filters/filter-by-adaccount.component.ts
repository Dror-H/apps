import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-filter-by-adaccount',
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
      >Account
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
          <div nz-col nzSm="24" *ngFor="let adaccount of clonedAdAccounts">
            <div class="table-filter-content-item" [ngClass]="{ active: adaccount.checked }">
              <label
                id="adaccount_{{ adaccount.id }}"
                nz-checkbox
                [(ngModel)]="adaccount.checked"
                (ngModelChange)="onChange()"
                [ngModelOptions]="{ standalone: true }"
              >
                {{ adaccount.name.length > 20 ? (adaccount.name | slice: 0:20) + '...' : adaccount.name }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class FilterByAdAccountComponent implements OnInit, OnChanges {
  @Input() adAccounts: any[];

  public allChecked = true;
  public indeterminate = false;
  public clonedAdAccounts: any[];

  @Output() selectedAdAccounts = new EventEmitter<any[]>();

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.adAccounts) {
      const { currentValue, previousValue }: SimpleChange = changes.adAccounts;
      if (currentValue?.length && JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
        this.clonedAdAccounts = cloneDeep(currentValue);
      }
      if (currentValue?.length === 0) {
        this.clonedAdAccounts = [];
      }
    }
  }

  onChange() {
    if (this.clonedAdAccounts.every((val, ind, arr) => val.checked === arr[0].checked)) {
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.selectedAdAccounts.emit(this.clonedAdAccounts);
  }

  public toggleAll() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.clonedAdAccounts = this.adAccounts.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.clonedAdAccounts = this.adAccounts.map((item) => ({
        ...item,
        checked: false,
      }));
    }
    this.onChange();
  }
}
