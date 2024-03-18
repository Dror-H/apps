import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule, Store } from '@ngxs/store';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BehaviorSubject, of } from 'rxjs';
import { CampaignsViewService } from '../../campaigns-view.service';
import { QuickActionsService } from '../../quick-actions.service';
import { AdsViewComponent } from './ads-view.component';

@Component({
  selector: 'app-data-table-templates',
  template: `<div></div>`,
})
class MockDataTableTemplatesComponent {
  @Input() state;
  @Input() config?: any = {};
  @Output() columnUpdated = new EventEmitter<any>();
}

@Component({
  selector: 'app-data-table-skeleton',
  template: `<div></div>`,
})
export class MockDataTableSkeletonComponent {
  @Input() columns: any;
  @Input() isScroll = false;
  @Input() isSelectable = true;
  @Input() isSearchable = true;
  @Input() isCustomizable = true;
}

@Component({
  selector: 'app-data-table',
  template: `<div></div>`,
})
export class MockDataTableComponent {
  cachedTableData: Array<any> = [];
  @Input() tableConfiguration: TableConfiguration;
  @Input() state: TableState;
  @Input() tableData: Array<any>;
  @Output() columnsChange = new EventEmitter<any[]>();
  @Output() stateChange = new EventEmitter<Partial<TableState>>();
}

@Directive({
  selector: '[ingoHighlight]',
})
export class MockHighlightDirective {
  @Input() searchedWords: string[];
  @Input() text: string;
  @Input() classToApply: string;
}

const mocks = [
  MockDataTableTemplatesComponent,
  MockDataTableSkeletonComponent,
  MockDataTableComponent,
  MockHighlightDirective,
];

describe('AdsViewComponent: ', () => {
  let component: AdsViewComponent;
  let fixture: ComponentFixture<AdsViewComponent>;
  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), NgxsSelectSnapshotModule, NzToolTipModule, NzSpinModule],
      declarations: [AdsViewComponent, ...mocks],
      providers: [
        { provide: CampaignsViewService, useValue: { ads$: () => of(), adsTableState$: new BehaviorSubject({}) } },
        { provide: QuickActionsService, useValue: {} },
      ],
    }).compileComponents();
    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsViewComponent);
    component = fixture.componentInstance;
    jest.spyOn(component as any, 'useCachedInsights', 'get').mockReturnValue(true);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should use cached', () => {
    expect((component as any).useCachedInsights).toBeTruthy();
  });
});
