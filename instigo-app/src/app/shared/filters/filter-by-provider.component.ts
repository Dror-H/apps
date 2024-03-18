import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-filter-by-provider',
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
      >Network
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
          <div nz-col nzSm="24" *ngFor="let provider of clonedProviders">
            <div class="table-filter-content-item" [ngClass]="{ active: provider.checked }">
              <label
                id="provider_{{ provider.value }}"
                nz-checkbox
                [(ngModel)]="provider.checked"
                (ngModelChange)="onChange()"
                [ngModelOptions]="{ standalone: true }"
              >
                {{ provider.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class FilterByProviderComponent implements OnInit, OnChanges {
  @Input() providers: any[];

  public allChecked = true;
  public indeterminate = false;
  public clonedProviders: any[];

  @Output() selectedProviders = new EventEmitter<any[]>();

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.providers) {
      const { currentValue, previousValue }: SimpleChange = changes.providers;
      if (currentValue?.length && JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
        this.clonedProviders = cloneDeep(currentValue);
      }
    }
  }

  onChange() {
    if (this.clonedProviders.every((val, ind, arr) => val.checked === arr[0].checked)) {
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.selectedProviders.emit(this.clonedProviders);
  }

  public toggleAll() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.clonedProviders = this.providers.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.clonedProviders = this.providers.map((item) => ({
        ...item,
        checked: false,
      }));
    }
    this.onChange();
  }
}
