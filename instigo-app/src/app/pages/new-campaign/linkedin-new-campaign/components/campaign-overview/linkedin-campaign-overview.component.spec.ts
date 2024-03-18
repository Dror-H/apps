import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkedinCampaignOverviewComponent } from './linkedin-campaign-overview.component';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ingo-linkedin-creative-variations-overview',
  template: '',
})
export class LinkedinCreativeVariationsMockComponent {
  @Input() creativesForm = new FormGroup({});
}

@Component({
  selector: 'ingo-audience-summary',
  template: '',
})
export class LinkedinTargetingOverviewMockComponent {
  @Input() audienceForm = new FormGroup({});
  @Input() isNewCamp = true;
}

@Component({
  selector: 'ingo-budget-overview',
  template: '',
})
export class LinkedinBudgetOverviewMockComponent {
  @Input() budgetSettings = new FormGroup({});
}

describe('LinkedinCampaignOverview', () => {
  let component: LinkedinCampaignOverviewComponent;
  let fixture: ComponentFixture<LinkedinCampaignOverviewComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LinkedinCampaignOverviewComponent,
        LinkedinCreativeVariationsMockComponent,
        LinkedinTargetingOverviewMockComponent,
        LinkedinBudgetOverviewMockComponent,
      ],
      imports: [CommonModule, NzCardModule, NzCollapseModule, NzDividerModule],
    });

    fixture = TestBed.createComponent(LinkedinCampaignOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should get the latest value of the step', () => {
    component.stepFunc = 3;
    expect(component.step).toEqual(3);
  });

  it('should update the step', () => {
    component.setStep(2);
    expect(component.step).toEqual(2);
  });
});
