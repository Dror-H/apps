import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-filter-by-type',
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
      >Type
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
      <div class="table-filter-content sm-content">
        <div nz-row nzGutter="10">
          <div nz-col nzSm="24" *ngFor="let type of clonedTypes">
            <div class="table-filter-content-item" [ngClass]="{ active: type.checked }">
              <label
                id="provider_{{ type.value }}"
                nz-checkbox
                [(ngModel)]="type.checked"
                (ngModelChange)="onChange()"
                [ngModelOptions]="{ standalone: true }"
              >
                {{ type.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      ::ng-deep .dropdown-menu {
        width: 200px;
      }
    `,
  ],
})
export class FilterByTypeComponent implements OnInit, OnChanges {
  @Input() types: any[];

  public allChecked = true;
  public indeterminate = false;
  public clonedTypes: any[];

  @Output() selectedTypes = new EventEmitter<any[]>();

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.types) {
      const { currentValue, previousValue }: SimpleChange = changes.types;
      if (currentValue?.length && JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
        this.clonedTypes = cloneDeep(currentValue);
      }
    }
  }

  onChange() {
    if (this.clonedTypes.every((val, ind, arr) => val.checked === arr[0].checked)) {
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.selectedTypes.emit(this.clonedTypes);
  }

  public toggleAll() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.clonedTypes = this.types.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.clonedTypes = this.types.map((item) => ({
        ...item,
        checked: false,
      }));
    }
    this.onChange();
  }
}
