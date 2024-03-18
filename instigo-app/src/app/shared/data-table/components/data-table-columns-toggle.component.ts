import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UpdateUser, UserState } from '@app/global/user.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { differenceBy, isEmpty, pullAllBy } from 'lodash-es';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataTableColumnConfig } from '../data-table.model';

@Component({
  selector: 'app-data-table-columns-toggle',
  template: `
    <div class="d-inline-block">
      <button
        #customizeColumnsBtn
        nz-button
        nzType="default"
        class="btn-primary btn-clear ant-btn ant-btn-primary"
        id="customizeColumns"
        nz-popover
        nzPopoverTrigger="click"
        nzPopoverPlacement="bottomRight"
        nzPopoverOverlayClassName="customize-columns-list"
        [nzPopoverTitle]="colCustomizeTitle"
        [nzPopoverContent]="colCustomizeContent"
      >
        Customize
      </button>
      <ng-template #colCustomizeTitle>
        <div nz-row nzGutter="10" nzJustify="space-between" nzAlign="middle">
          <div nz-col nzSm="12">Customize Columns</div>
          <div nz-col nzSm="12">
            <button nz-button nzType="primary" class="btn-dark btn-clear btn-small" (click)="toggleAll()">
              {{ nextToggleToOff ? 'Disable' : 'Enable' }} All
            </button>
          </div>
        </div>
      </ng-template>
      <ng-template #colCustomizeContent>
        <div class="customize-columns-dropdown">
          <div nz-row nzGutter="10">
            <div nz-col nzSm="12" *ngFor="let column of cachedColumns">
              <div
                class="customize-columns-dropdown-item"
                [ngClass]="{ 'active-column': column.checked, 'unhideable-column': column.unhideable }"
              >
                <input
                  id="column__{{ column.name }}"
                  type="checkbox"
                  [disabled]="column.unhideable"
                  [checked]="column.unhideable || column.checked"
                  [(ngModel)]="column.checked"
                  (click)="toggle(column)"
                />
                <label for="column__{{ column.name }}">
                  {{ column.name.length > 15 ? (column.name | slice: 0:15) + '...' : column.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableColumnsToggleComponent implements OnInit {
  @ViewChild('perfectscrollbar') perfectscrollbar: PerfectScrollbarComponent;
  @Input() columns: Array<DataTableColumnConfig> = [];
  @Input() tableId: string;
  @Output() columnsUpdated = new EventEmitter<any[]>();
  public cachedColumns: Array<DataTableColumnsToggleCachedColumns>;
  public nextToggleToOff = true;

  @Select(UserState.get) private getUser$: Observable<any>;

  ngOnInit(): void {
    this.updateCachedColumns(this.columns);
  }

  public toggle(column) {
    if (column.checked) {
      pullAllBy(this.columns, [column], 'prop');
      this.setColumns(
        this.tableId,
        this.columns.map((col) => ({ name: col.name, prop: col.prop })),
      );
      if (this.cachedColumns.length !== this.columns.length) {
        this.nextToggleToOff = false;
      }
    } else {
      const index = this.cachedColumns.indexOf(column);
      this.columns.splice(index, 0, column);
      this.setColumns(
        this.tableId,
        this.columns.map((col) => ({ name: col.name, prop: col.prop })),
      );
      if (this.columns.length === this.cachedColumns.length) {
        this.nextToggleToOff = true;
      }
    }
  }

  public toggleAll(): void {
    this.cachedColumns.forEach((column, i) => {
      if (!column.unhideable) {
        if (this.nextToggleToOff) {
          pullAllBy(this.columns, [column], 'prop');
          column.checked = false;
        } else {
          const isColumnSelected = this.columns.some((c) => c.prop === column.prop);
          if (!isColumnSelected) {
            this.columns.splice(i, 0, column);
          }
          column.checked = true;
        }
      }
    });
    this.setColumns(
      this.tableId,
      this.columns.map((col) => ({ name: col.name, prop: col.prop })),
    );
    this.nextToggleToOff = !this.nextToggleToOff;
  }

  @Dispatch()
  setColumns(tableId, columns) {
    const payload = {
      settings: {
        [tableId]: columns,
      },
    };
    this.columnsUpdated.emit(columns);
    return new UpdateUser(payload);
  }

  private updateCachedColumns(columns: Array<DataTableColumnConfig>) {
    this.cachedColumns = [...columns];
    this.getUser$.pipe(take(1)).subscribe(({ settings }) => {
      const userColumns = settings?.[this.tableId];
      if (!isEmpty(userColumns)) {
        pullAllBy(this.columns, differenceBy(this.columns, userColumns, 'prop'), 'prop');
      }
      this.cachedColumns = [
        ...this.cachedColumns.map((column) => ({ ...column, checked: this.columns.indexOf(column) !== -1 })),
      ];
    });
    this.perfectscrollbar?.directiveRef.update();
  }
}

interface DataTableColumnsToggleCachedColumns extends DataTableColumnConfig {
  checked?: boolean;
}
