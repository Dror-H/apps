import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BehaviorSubject, of } from 'rxjs';
import { CampaignsViewService } from '../../campaigns-view.service';
import { QuickActionsService } from '../../quick-actions.service';
import { CampaignsViewComponent } from './campaigns-view.component';

@Component({
  selector: 'app-data-table',
  template: `<div></div>`,
})
export class MockDataTableComponent {
  @Input() tableConfiguration: TableConfiguration;
  @Input() state: TableState;
  @Input() tableData: Array<any>;
  @Output() columnsChange = new EventEmitter<any[]>();
  @Output() stateChange = new EventEmitter<Partial<TableState>>();
}

@Component({
  selector: 'app-data-table-templates',
  template: `<div></div>`,
})
export class MockDataTableTemplatesComponent {
  @Input()
  state;

  @Input()
  config?: any = {};

  @Output()
  columnUpdated = new EventEmitter<any>();
}

describe('CampaignsViewComponent: ', () => {
  let component: CampaignsViewComponent;
  let fixture: ComponentFixture<CampaignsViewComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreTestBedModule.configureTestingModule([]),
        NgxsSelectSnapshotModule,
        UiSharedModule,
        NzToolTipModule,
        NzSpinModule,
        RouterTestingModule,
      ],
      declarations: [CampaignsViewComponent, MockDataTableComponent, MockDataTableTemplatesComponent],
      providers: [
        {
          provide: CampaignsViewService,
          useValue: { campaigns$: () => of(), campaignsTableState$: new BehaviorSubject({}) },
        },
        { provide: QuickActionsService, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignsViewComponent);
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
