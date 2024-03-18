import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ChartsModule } from 'ng2-charts';
import { of } from 'rxjs';
import { MultiChartsWidgetComponent } from './multi-charts.widget.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

describe('Multi charts widget', () => {
  let fixture: ComponentFixture<MultiChartsWidgetComponent>;
  let component: MultiChartsWidgetComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        ChartsModule,
        NzGridModule,
        NzSkeletonModule,
        NzToolTipModule,
        UiSharedModule,
        NzSpinModule,
      ],
      declarations: [MultiChartsWidgetComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MultiChartsWidgetComponent);
    component = fixture.debugElement.componentInstance;
    component.adAccountInsights$ = of({ type: 'finish', value: {} });
    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });
});
