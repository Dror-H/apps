import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignDetailsService } from '@app/pages/campaign-details/campaign-details.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ChartsModule } from 'ng2-charts';
import { of } from 'rxjs';
import { MainChartWidgetComponent } from './main-chart.widget.component';

describe('Main Chart Widget', () => {
  let fixture: ComponentFixture<MainChartWidgetComponent>;
  let component: MainChartWidgetComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ChartsModule, NzGridModule, NzSkeletonModule, UiSharedModule],
      declarations: [MainChartWidgetComponent],
      providers: [
        {
          provide: CampaignDetailsService,
          useValue: {
            isDataGrouped: () => {},
            buildChart: () => {},
          },
        },
        {
          provide: AnalyticsService,
          useValue: {
            sendEvent: () => {},
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MainChartWidgetComponent);
        component = fixture.debugElement.componentInstance;
        component.adAccountInsights$ = of({ type: 'finish', value: {} });
        fixture.detectChanges();
      });
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });
});
