import { Component, Directive, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';

import { SharedModule } from '@app/shared/shared/shared.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTSType } from 'ng-zorro-antd/core/types';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTooltipBaseDirective, NzTooltipTrigger } from 'ng-zorro-antd/tooltip';
import { InsightsCardsComponent } from './insights-cards.component';

@Directive({
  selector: '[baseChart]',
  exportAs: 'base-chart',
})
class MockBaseChartDirective {
  @Input() height: string;
  @Input() id: string;
  @Input() datasets: string;
  @Input() labels: string;
  @Input() options: string;
  @Input() chartType: string;
}

@Pipe({
  name: 'shortNumber',
})
export class MockShortNumberPipe implements PipeTransform {
  transform(number: number, args?: any): any {
    return number;
  }
}

@Component({
  selector: 'app-empty-range',
  template: `<div></div>`,
})
class MockEmptyRangeComponent {}

@Directive({
  selector: '[ingoTooltip]',
  exportAs: 'ingoTooltip',
})
export class IngoTooltipDirective extends NzTooltipBaseDirective {
  @Input('nzTooltipTitle') title?: NzTSType | null;
  @Input('nzTooltipTrigger') trigger?: NzTooltipTrigger = 'hover';
  @Input('nzTooltipPlacement') placement?: string | string[] = 'top';
  @Input('nzTooltipOverlayClassName') overlayClassName?: string;
  @Input() nzTooltipColor?: string;

  // tslint:disable-next-line:no-output-rename
  @Output('nzTooltipVisibleChange') readonly visibleChange = new EventEmitter<boolean>();
}

describe('InsightsCardsComponent', () => {
  let component: InsightsCardsComponent;
  let fixture: ComponentFixture<InsightsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, FormsModule, NzCardModule, NzSkeletonModule, NzInputNumberModule, NzGridModule],
      declarations: [
        InsightsCardsComponent,
        MockBaseChartDirective,
        MockEmptyRangeComponent,
        MockShortNumberPipe,
        IngoTooltipDirective,
      ],
      providers: [{ provide: AnalyticsService, useValue: { sendEvent: () => {} } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
