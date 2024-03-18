import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudienceDetailsDrawerState } from '@audience-app/store/audience-details-drawer.state';
import { TargetingConditionDto, TargetingType, TargetingTypesPercentages } from '@instigo-app/data-transfer-object';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { AudienceDetailsDrawerComponent } from './audience-details-drawer.component';

@Component({
  selector: 'audi-details-overview',
  template: `<div></div>`,
})
export class MockAudienceDetailsOverviewComponent {
  @Input() rank: number;
  @Input() specRatio: TargetingTypesPercentages;
}

@Component({
  selector: 'audi-targeting-title',
  template: `<div></div>`,
})
export class MockAudienceTargetingTitleComponent {
  @Input() title: string;
}

@Component({
  selector: 'audi-segment',
  template: `<div></div>`,
})
export class MockAudienceSegmentComponent {
  @Input() segment: TargetingConditionDto<TargetingType>;
}

@Component({
  selector: 'audi-details-user-tags',
  template: `<div></div>`,
})
export class MockAudienceDetailsUserTagsComponent {
  @Input() userTags: string[];
}

const mockComponents = [
  MockAudienceDetailsOverviewComponent,
  MockAudienceTargetingTitleComponent,
  MockAudienceSegmentComponent,
  MockAudienceDetailsUserTagsComponent,
];

describe('AudienceDetailsDrawerComponent', () => {
  let component: AudienceDetailsDrawerComponent;
  let fixture: ComponentFixture<AudienceDetailsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceDetailsDrawerComponent, ...mockComponents],
      imports: [
        StoreTestBedModule.configureTestingModule([AudienceDetailsDrawerState]),
        NzDrawerModule,
        NzTypographyModule,
        NzDividerModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceDetailsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
