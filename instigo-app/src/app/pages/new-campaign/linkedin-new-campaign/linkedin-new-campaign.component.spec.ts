import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkedinNewCampaignComponent } from '@app/pages/new-campaign/linkedin-new-campaign/linkedin-new-campaign.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { LinkedinNewCampaignFormCreatorManagerService } from './services/linkedin-new-campaign-form-creator-manager.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdAccountDTO } from '@instigo-app/data-transfer-object';
import { NewCampaignLayoutService } from '../new-campaign-layout.service';
import { NewCampaignService } from '../services/new-campaign.service';
import { LinkedinNewCampaignBackgroundFormService } from './services/linkedin-new-campaign-background-form.service';
import { CampaignDraftApiService } from '@app/api/services/campaign-draft.api.service';
import { RouterModule } from '@angular/router';
import { ValidatorApiService } from '@app/api/services/validator-api.service';

@Component({
  selector: 'ingo-linkedin-campaign-settings',
  template: '',
})
class LinkedinCampaignSettingsMockComponent {
  @Input() settingsForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
}

@Component({
  selector: 'ingo-linkedin-creative-settings',
  template: '',
})
class LinkedinCampaignCreativesMockComponent {
  @Input() creativesForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
}

@Component({
  selector: 'ingo-linkedin-targeting-settings',
  template: '',
})
class LinkedinCampaignTargetingMockComponent {
  @Input() adAccount: AdAccountDTO;
  @Input() targetingForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
}

@Component({
  selector: 'ingo-linkedin-budget-settings',
  template: '',
})
class LinkedinCampaignBudgetMockComponent {
  @Input() budgetForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
}

@Component({
  selector: 'ingo-linkedin-campaign-overview',
  template: '',
})
class LinkedinCampaignOverviewComponent {
  public step: number;
  @Input() campaignForm: FormGroup;
  @Output() collapseStep = new EventEmitter<number>();

  @Input() set stepFunc(value: number) {
    this.step = value;
  }
}

describe('LinkedinNewCampaignComponent', () => {
  let fixture: ComponentFixture<LinkedinNewCampaignComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LinkedinNewCampaignComponent,
        LinkedinCampaignSettingsMockComponent,
        LinkedinCampaignTargetingMockComponent,
        LinkedinCampaignCreativesMockComponent,
        LinkedinCampaignBudgetMockComponent,
        LinkedinCampaignOverviewComponent,
      ],
      imports: [ReactiveFormsModule, NzFormModule, NzCollapseModule, CommonModule, RouterModule.forRoot([])],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        LinkedinNewCampaignFormCreatorManagerService,
        NewCampaignLayoutService,
        { provide: LinkedinNewCampaignBackgroundFormService, useValue: {} },
        { provide: CampaignDraftApiService, useValue: {} },
        { provide: NewCampaignService, useValue: {} },
        { provide: ValidatorApiService, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(LinkedinNewCampaignComponent);
  });

  it('should be defined', () => {
    expect(fixture.componentInstance).toBeDefined();
  });
});
