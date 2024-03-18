import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DataTableColumnConfig } from '../data-table.model';

@Component({
  selector: 'app-data-table-column-edit-modal',
  template: `
    <div>
      <p>Select a target field for this column:</p>
      <nz-select class="customize-column-select" [(ngModel)]="field">
        <nz-option
          *ngFor="let option of options"
          [nzValue]="option.name"
          [nzLabel]="option.name"
          [nzDisabled]="!fieldIsAvailable(option.value)"
        ></nz-option>
      </nz-select>
      <nz-divider></nz-divider>
      <div nz-row nzJustify="end" [nzGutter]="16">
        <div nz-col>
          <button nz-button nzType="default" (click)="activeModal.close()">
            <span>Cancel</span>
          </button>
        </div>
        <div nz-col>
          <button nz-button nzType="primary" (click)="selectColumnLabel()">
            <span>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DataTableColumnEditModalComponent implements OnInit {
  @Input() column: DataTableColumnConfig;

  @Input() options: { name: string; value: any }[] = [];

  @Input() fieldsAvailable: string[] = [];

  field = '';

  constructor(public activeModal: NzModalRef) {}

  ngOnInit(): void {
    this.field = this.column?.name || '';
  }
  selectColumnLabel(): void {
    this.activeModal.close(this.field);
  }

  fieldIsAvailable(field: string): boolean {
    return this.fieldsAvailable.includes(field);
  }
}
