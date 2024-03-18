import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AudienceDetailsOverviewComponent } from './audience-details-overview.component';

@Pipe({ name: 'getColorByMatch' })
export class MockGetColorByMatchPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

@Pipe({ name: 'getColorByTargeting' })
export class MockGetColorByTargeting implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('AudienceDetailsOverviewComponent', () => {
  let component: AudienceDetailsOverviewComponent;
  let fixture: ComponentFixture<AudienceDetailsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceDetailsOverviewComponent, MockGetColorByMatchPipe, MockGetColorByTargeting],
      imports: [NzGridModule, NzTagModule, NzDividerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceDetailsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
