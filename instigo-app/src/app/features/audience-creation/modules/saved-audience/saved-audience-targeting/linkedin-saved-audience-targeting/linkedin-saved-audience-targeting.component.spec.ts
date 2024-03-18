import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkedinSavedAudienceTargetingComponent } from './linkedin-saved-audience-targeting.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TargetingApiService } from '@app/api/services/target-template.api.service';

@Component({
  selector: 'ingo-location-selector-container',
  template: '',
})
export class LocationSelectorMockComponent {
  @Input() providerId;
  @Input() provider;
  @Input() rules;
  @Output() getReach = new EventEmitter();
}

@Component({
  selector: 'ingo-linkedin-detailed-targeting',
  template: '',
})
export class LinkedinDetailedTargetingMockComponent {
  @Output() targetingCriteria;
  @Input() adAccountProviderId;
  @Input() provider;
  @Input() include;
  @Input() exclude;
}

@Component({
  selector: 'ingo-custom-audience-container',
  template: '',
})
export class CustomAudienceMockComponent {
  @Input() demographicsForm;
  @Input() adAccount;
}

describe('LinkedinSavedAudienceTargetingComponent', () => {
  let linkedinSavedAudienceComponent: LinkedinSavedAudienceTargetingComponent;
  let linkedinSavedAudienceFixture: ComponentFixture<LinkedinSavedAudienceTargetingComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LinkedinSavedAudienceTargetingComponent,
        LocationSelectorMockComponent,
        LinkedinDetailedTargetingMockComponent,
        CustomAudienceMockComponent,
      ],
      imports: [CommonModule, ReactiveFormsModule, NzDividerModule, NzFormModule],
      providers: [{ provide: TargetingApiService, useValue: {} }],
    });
    linkedinSavedAudienceFixture = TestBed.createComponent(LinkedinSavedAudienceTargetingComponent);
    linkedinSavedAudienceComponent = linkedinSavedAudienceFixture.componentInstance;
  });

  it('should be defined', () => {
    expect(linkedinSavedAudienceComponent).toBeDefined();
  });
});
