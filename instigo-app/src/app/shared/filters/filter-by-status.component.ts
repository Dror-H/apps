import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { AudienceAvailability, CampaignStatusType } from '@instigo-app/data-transfer-object';
import { cloneDeep } from 'lodash-es';

type StatusList = {
  label: string;
  status: CampaignStatusType | AudienceAvailability;
  icon: string;
  checked: boolean;
};

@Component({
  selector: 'app-filter-by-status',
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
      >Status
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
          <div nz-col nzSm="24" *ngFor="let status of clonedStatusList">
            <div class="table-filter-content-item" [ngClass]="{ active: status.checked }">
              <label
                id="provider_{{ status.status }}"
                nz-checkbox
                [(ngModel)]="status.checked"
                (ngModelChange)="onChange()"
                [ngModelOptions]="{ standalone: true }"
              >
                {{ status.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class FilterByStatusComponent implements OnInit, OnChanges {
  @Input() statusList: StatusList[];

  public allChecked = true;
  public indeterminate = false;
  public clonedStatusList: StatusList[];

  @Output() selectedStatus = new EventEmitter<any[]>();

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.statusList) {
      const { currentValue, previousValue }: SimpleChange = changes.statusList;
      if (currentValue?.length && JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
        this.clonedStatusList = cloneDeep(currentValue);
      }
    }
  }

  public onChange() {
    if (this.clonedStatusList.every((val, ind, arr) => val.checked === arr[0].checked)) {
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.selectedStatus.emit(this.clonedStatusList);
  }

  public toggleAll() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.clonedStatusList = this.statusList.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.clonedStatusList = this.statusList.map((item) => ({
        ...item,
        checked: false,
      }));
    }
    this.onChange();
  }
}
