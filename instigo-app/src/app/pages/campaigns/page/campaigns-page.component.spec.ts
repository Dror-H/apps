import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AdSetApiService } from '@app/api/services/ad-set.api.service';
import { AdApiService } from '@app/api/services/ad.api.service';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { DateTimeInterval } from '@instigo-app/data-transfer-object';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule } from '@ngxs/store';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BehaviorSubject, of } from 'rxjs';
import { CampaignsViewService } from '../campaigns-view.service';
import { CampaignsPageComponent } from './campaigns-page.component';

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
class MockDateRangePickerComponent extends ControlValueAccessorBaseHelper<DateTimeInterval> {
  @Input() sourcePage = '';
}
@Component({
  selector: 'app-campaigns-view',
  template: `<div></div>`,
})
class MockCampaignsViewComponent {}

@Component({
  selector: 'app-filter-by-provider',
  template: `<div></div>`,
})
class MockFilterByProviderComponent {
  @Input() providers: any[];
}
@Component({
  selector: 'app-filter-by-adaccount',
  template: `<div></div>`,
})
class MockFilterByAdAccountComponent {
  @Input() adAccounts: any[];
  @Output() selectedAdAccounts = new EventEmitter<any[]>();
}
@Component({
  selector: 'app-filter-by-status',
  template: `<div></div>`,
})
class MockFilterByStatusComponent {
  @Input() statusList: string;
  @Output() selectedStatus = new EventEmitter<any[]>();
}

@Component({
  selector: 'app-adsets-view',
  template: `<div></div>`,
})
export class MockAdSetsViewComponent {}
@Component({
  selector: 'app-ads-view',
  template: `<div></div>`,
})
export class MockAdsViewComponent {}

const components = [
  MockDateRangePickerComponent,
  MockCampaignsViewComponent,
  MockFilterByAdAccountComponent,
  MockFilterByStatusComponent,
  MockFilterByProviderComponent,
  MockAdSetsViewComponent,
  MockAdsViewComponent,
];

describe('CampaignsPageComponent ', () => {
  let component: CampaignsPageComponent;
  let fixture: ComponentFixture<CampaignsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        NgxsSelectSnapshotModule,
        NzTabsModule,
        NzPageHeaderModule,
        NzGridModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [CampaignsPageComponent, ...components],
      providers: [
        {
          provide: CampaignsViewService,
          useValue: {
            activeTab$: new BehaviorSubject({}),
            filters$: new BehaviorSubject({}),
            campaignsTableState$: of({}),
          },
        },
        { provide: CampaignApiService, useValue: {} },
        { provide: AdSetApiService, useValue: {} },
        { provide: AdApiService, useValue: {} },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
