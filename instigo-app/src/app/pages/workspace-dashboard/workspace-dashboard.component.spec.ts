import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservableLoadingInterface, User } from '@instigo-app/data-transfer-object';
import { NgxsModule, Store } from '@ngxs/store';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';

import { WorkspaceDashboardComponent } from './workspace-dashboard.component';
import { WorkspaceDashboardService } from './workspace-dashboard.service';

@Component({
  selector: 'ingo-workspace-widget-insights-cards',
  template: `<div></div>`,
})
export class MockInsightsCardsComponent {
  @Input() workspaceInsights$: BehaviorSubject<any> = new BehaviorSubject(null);
}

@Component({
  selector: 'ingo-workspace-widget-provider-insights',
  template: `<div></div>`,
})
export class MockProviderInsightsComponent {
  @Input() workspaceInsights$: BehaviorSubject<any> = new BehaviorSubject(null);
}

@Component({
  selector: 'ingo-workspace-widget-ad-accounts-table',
  template: `<div></div>`,
})
export class MockAdAccountsTableComponent {
  @Input() public adAccounts$: Observable<ObservableLoadingInterface<any[]>>;
}

@Component({
  selector: 'ingo-workspace-dashboard-campaigns-table',
  template: `<div></div>`,
})
export class MockCampaignsTableComponent {}

@Component({
  selector: 'ingo-workspace-activity',
  template: `<div></div>`,
})
export class MockWorkspaceActivityComponent {}

@Component({
  selector: 'ingo-workspace-overview-card',
  template: `<div></div>`,
})
export class MockWorkspaceOverviewComponent {
  @Input() workspace$: Observable<ObservableLoadingInterface<any>>;
}

@Component({
  selector: 'ingo-workspace-trackers',
  template: `<div></div>`,
})
export class MockWorkspaceTrackersComponent {
  @Input()
  public adAccounts$: Observable<ObservableLoadingInterface<any[]>>;
}

@Component({
  selector: 'ingo-workspace-widget-members',
  template: `<div></div>`,
})
export class MockMembersComponent {
  @Input()
  public members$: Observable<ObservableLoadingInterface<User[]>>;
}

const mockComponents = [
  MockInsightsCardsComponent,
  MockProviderInsightsComponent,
  MockAdAccountsTableComponent,
  MockCampaignsTableComponent,
  MockWorkspaceActivityComponent,
  MockWorkspaceOverviewComponent,
  MockMembersComponent,
  MockWorkspaceTrackersComponent,
];

describe('WorkspaceDashboardComponent', () => {
  let component: WorkspaceDashboardComponent;
  let fixture: ComponentFixture<WorkspaceDashboardComponent>;
  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), NzTabsModule, NzGridModule],
      providers: [
        {
          provide: WorkspaceDashboardService,
          useValue: {
            workspaceMembers: jest.fn(),
            get: jest.fn().mockReturnValue(of(EMPTY)),
            workspaceActivity: jest.fn().mockReturnValue(of(EMPTY)),
          },
        },
      ],
      declarations: [WorkspaceDashboardComponent, ...mockComponents],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'select').mockReturnValue(of({}));
    fixture = TestBed.createComponent(WorkspaceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
