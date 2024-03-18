import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { TableAction } from '../data-table.model';

@Component({
  selector: 'app-data-table-quick-actions',
  template: `
    <div *ngIf="selectedItems.length > 0" class="quick-actions-toolbar" [@fadeBarIn]>
      <div class="toolbar-left">
        <span>{{ selectedItems.length }}</span> selected
      </div>
      <div class="toolbar-right" *ngIf="quickActions?.length > 0">
        <ng-container *ngFor="let action of quickActions">
          <button
            *ngIf="!action.divider"
            nz-button
            nzType="primary"
            class="btn-bold btn-raised btn-action"
            (click)="action.callback(selectedItems)"
            [disabled]="
              (action.singleSelect && selectedItems.length >= 2) || (action.multipleSelect && selectedItems.length < 2)
            "
          >
            <i class="fas fa-angle-down fa-fw mr-1" [ngClass]="[action.icon, action.extraClass || '']"></i>
            {{ action.label }}
          </button>
        </ng-container>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeBarIn', [
      transition(':enter', [style({ opacity: '0' }), animate('250ms ease-in', style({ opacity: '1' }))]),
      transition(':leave', [style({ opacity: '1' }), animate('250ms ease-in', style({ opacity: '0' }))]),
    ]),
  ],
})
export class DataTableQuickActionsComponent implements OnInit {
  @Input()
  selectedItems: Array<any> = [];

  @Input()
  quickActions: TableAction[] = [];

  constructor() {}

  ngOnInit(): void {}
}
