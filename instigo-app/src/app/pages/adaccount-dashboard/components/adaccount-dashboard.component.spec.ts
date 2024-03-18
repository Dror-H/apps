import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AdAccountDashboardComponent } from '@app/pages/adaccount-dashboard/components/adaccount-dashboard-component';
import { AdAccountDTO, DateTimeInterval } from '@instigo-app/data-transfer-object';
import { ControlValueAccessorBaseHelper, UiSharedModule } from '@instigo-app/ui/shared';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { SessionState } from '../session-state.state';

@Component({
  selector: 'ingo-ad-account-dropdown-selector',
  template: `<div></div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockDashboardAdAccountDropdownSelectorComponent),
      multi: true,
    },
  ],
})
export class MockDashboardAdAccountDropdownSelectorComponent extends ControlValueAccessorBaseHelper {
  @Input() adAccounts: AdAccountDTO[] = [];
}

@Component({
  selector: 'ingo-date-range-picker',
  template: `<div></div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockDateRangePickerComponent),
      multi: true,
    },
  ],
})
export class MockDateRangePickerComponent extends ControlValueAccessorBaseHelper {
  @Input() sourcePage = '';
  @Input() formControlName: string;
}

@Component({
  selector: 'ingo-ad-account-overview',
  template: `<div></div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockAdAccountOverviewComponent),
      multi: true,
    },
  ],
})
export class MockAdAccountOverviewComponent extends ControlValueAccessorBaseHelper {}

@Component({
  selector: 'app-campings-table',
  template: `<div></div>`,
})
export class MockCampaignsTableComponent {
  @Input() adAccount: AdAccountDTO;
  @Input() dateRange: DateTimeInterval;
}

const mocks = [
  MockDashboardAdAccountDropdownSelectorComponent,
  MockDateRangePickerComponent,
  MockAdAccountOverviewComponent,
  MockCampaignsTableComponent,
];

describe('Dashboard Component', () => {
  let fixture: ComponentFixture<AdAccountDashboardComponent>;
  let component: AdAccountDashboardComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdAccountDashboardComponent, ...mocks],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        StoreTestBedModule.configureTestingModule([SessionState]),
        NgxsSelectSnapshotModule.forRoot(),
        NgxsEmitPluginModule.forRoot(),
        UiSharedModule,
        NzGridModule,
        NzPageHeaderModule,
        NzCardModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdAccountDashboardComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });
});
