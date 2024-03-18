import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdAccountApiServiceMock } from '@app/api/services/ad-account.api.service.mock';
import { NgxsModule } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdAccountOverviewComponent } from './ad-account-overview.component';
import { AdAccountOverviewModule } from './ad-account-overview.module';

@Component({
  selector: 'ingo-main-chart-widget',
  template: '',
})
class MockMainChartWidgetComponent {
  @Input() adAccountInsights$: Observable<any>;
  @Input() chartType$ = new BehaviorSubject('bar');
}

@Component({
  selector: 'ingo-multi-charts',
  template: '',
})
class MockMultiChartsWidgetComponent {
  @Input() adAccountInsights$: Observable<any>;
}

describe('Ad-account overview component', () => {
  let fixture: ComponentFixture<AdAccountOverviewComponent>;
  let component: AdAccountOverviewComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockMainChartWidgetComponent, MockMultiChartsWidgetComponent],
      imports: [AdAccountOverviewModule, NgxsModule.forRoot()],
      providers: [{ provide: 'AdAccountApiService', useClass: AdAccountApiServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdAccountOverviewComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  xit('should initialize', () => {
    expect(component).toBeTruthy();
  });
});
