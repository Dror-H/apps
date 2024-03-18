import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { AudienceSegmentComponent } from './audience-segment.component';

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
  name: 'toBreadcrumbs',
})
export class MockToBreadcrumbsPipe implements PipeTransform {
  transform(text: string): string {
    return text;
  }
}

@Pipe({
  name: 'ellipsis',
})
export class MockEllipsisPipe implements PipeTransform {
  transform(text: string): string {
    return text;
  }
}

@Pipe({ name: 'shortNumber', pure: true })
export class MockShortNumberPipe implements PipeTransform {
  transform(value: number, isPercentage = true): string {
    return '';
  }
}

const mockPipes = [
  MockGetColorByTargetingPipe,
  MockGetColorByMatchPipe,
  MockToBreadcrumbsPipe,
  MockEllipsisPipe,
  MockShortNumberPipe,
];

describe('AudienceSegmentComponent', () => {
  let component: AudienceSegmentComponent;
  let fixture: ComponentFixture<AudienceSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceSegmentComponent, ...mockPipes],
      imports: [NzDividerModule, NzTagModule, NzGridModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
