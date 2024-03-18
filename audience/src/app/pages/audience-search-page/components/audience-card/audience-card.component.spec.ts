import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { regularSearchResult } from '@audience-app/pages/audience-edit-page/mocks';
import {
  excludedTargetingResult,
  includedTargetingResult,
} from '@audience-app/pages/audience-search-page/components/audience-card/audience-card.mocks';
import { TargetingConditionDto, TargetingType, TargetingTypesPercentages } from '@instigo-app/data-transfer-object';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AudienceCardComponent } from './audience-card.component';

@Pipe({ name: 'shortNumber', pure: true })
export class MockShortNumberPipe implements PipeTransform {
  transform(value: number, isPercentage = true): string {
    return '';
  }
}

@Pipe({
  name: 'getColorByTargeting',
})
export class MockGetColorByTargetingPipe implements PipeTransform {
  transform(targetingType: string, mode: string): string {
    return targetingType;
  }
}

@Pipe({
  name: 'getColorByMatch',
})
export class MockGetColorByMatchPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

@Pipe({
  name: 'ellipsis',
})
export class MockEllipsisPipe implements PipeTransform {
  transform(text: string, maxLength: number): string {
    return text;
  }
}

@Pipe({
  name: 'toBreadcrumbs',
})
export class MockToBreadcrumbsPipe implements PipeTransform {
  transform(text: string): string {
    return text;
  }
}

@Component({
  selector: 'audi-details-overview',
  template: `<div></div>`,
})
export class MockAudienceDetailsOverviewComponent {
  @Input() rank: number;
  @Input() specRatio: TargetingTypesPercentages;
}

@Component({
  selector: 'audi-segment',
  template: `<div></div>`,
})
export class MockAudienceSegmentComponent {
  @Input() segment: TargetingConditionDto<TargetingType>;
}

const mockPipes = [
  MockShortNumberPipe,
  MockGetColorByTargetingPipe,
  MockEllipsisPipe,
  MockGetColorByMatchPipe,
  MockToBreadcrumbsPipe,
];

const mockComponents = [MockAudienceDetailsOverviewComponent, MockAudienceSegmentComponent];

describe('AudienceCardComponent', () => {
  let component: AudienceCardComponent;
  let fixture: ComponentFixture<AudienceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceCardComponent, ...mockPipes, ...mockComponents],
      imports: [FormsModule, NzCardModule, NzRateModule, NzDividerModule, NzTagModule, NzGridModule, NzDrawerModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AudienceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openDrawer', () => {});

  describe('getIncludedTargeting', () => {
    it('should do nothing', () => {
      (component as any).getIncludedTargeting();
      expect(component.includedTargeting).toBeUndefined();
    });

    it('should set includedTargeting', () => {
      component.audience = regularSearchResult;
      (component as any).getIncludedTargeting();
      expect(component.includedTargeting).toEqual(includedTargetingResult);
    });
  });

  describe('getExcludedTargeting', () => {
    it('should do nothing', () => {
      (component as any).getExcludedTargeting();
      expect(component.includedTargeting).toBeUndefined();
    });

    it('should set excludedTargeting', () => {
      component.audience = regularSearchResult;
      (component as any).getExcludedTargeting();
      expect(component.excludedTargeting).toEqual(excludedTargetingResult);
    });
  });
});
