import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewCampaignService } from '@app/pages/new-campaign/services/new-campaign.service';
import { rangeValidator } from '@app/shared/shared/custom-form.validators';
import { BudgetType, CampaignStatusType, LinkedinCostType } from '@instigo-app/data-transfer-object';
import { TranslateModule } from '@ngx-translate/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NgxCurrencyModule } from 'ngx-currency';
import { of } from 'rxjs';
import { LinkedinBudgetSettingsComponent } from './linkedin-budget-settings.component';

@Component({
  selector: 'ingo-campaign-schedule',
  template: '',
})
class CampaignScheduleMockComponent {
  @Input() budgetForm: FormGroup;
}

@Component({
  selector: 'ingo-budget-type-selector',
  template: '',
})
class CampaignBudgetTypeSelectorMockComponent {}

@Component({
  selector: 'ingo-bid-strategy-selector',
  template: '',
})
class CampaignBidStrategySelectorMockComponent {
  @Input() costType;
}

@Component({
  selector: 'ingo-explain',
  template: '',
})
class IngoExplainMockComponent {
  @Input() tooltipId;
}

const fb = new FormBuilder();
const timeNow = new Date('12-06-2021');

describe('linkedin budget settings', () => {
  let fixture: ComponentFixture<LinkedinBudgetSettingsComponent>;
  let component: LinkedinBudgetSettingsComponent;
  let campaignFormMock: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LinkedinBudgetSettingsComponent,
        CampaignScheduleMockComponent,
        CampaignBidStrategySelectorMockComponent,
        CampaignBudgetTypeSelectorMockComponent,
        IngoExplainMockComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        NzCardModule,
        NzFormModule,
        NzRadioModule,
        NzToolTipModule,
        NzInputModule,
        NgxCurrencyModule,
        NzAlertModule,
        NzSelectModule,
        NzDividerModule,
        NzButtonModule,
      ],
      providers: [
        {
          provide: NewCampaignService,
          useValue: {
            getLinkedinBidSuggestions: () =>
              of({
                dailyBudgetLimits: {
                  min: {
                    amount: 3,
                  },
                  max: {
                    amount: 23,
                  },
                  default: {
                    amount: 10,
                  },
                },
                suggestedBid: {
                  default: {
                    amount: 5,
                  },
                },
              }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    campaignFormMock = fb.group({
      settings: fb.group({
        account: [{ currency: 'USD' }],
        status: ['PAUSED'],
      }),
      budget: fb.group(
        {
          range: fb.group({
            startDate: [timeNow],
            startTime: [
              `${`0${timeNow.getHours()}`.substr(-2)}:${`0${timeNow.getMinutes()}`.substr(-2)}`,
              [Validators.pattern('[0-2][0-9]:[0-6][0-9]')],
            ],
            endDate: [null],
            endTime: [null, [Validators.pattern('[0-2][0-9]:[0-6][0-9]')]],
          }),
          costType: [LinkedinCostType.CPC, [Validators.required]],
          budgetType: [BudgetType.DAILY, [Validators.required]],
          budget: [null, [Validators.required, Validators.min(0)]],
          spendCap: [null, [Validators.required, Validators.min(0)]],
        },
        { validators: [rangeValidator] } as AbstractControlOptions,
      ),
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinBudgetSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should initialize currency code', fakeAsync(() => {
    component.budgetForm = campaignFormMock.get('budget') as FormGroup;
    component.ngOnInit();
    tick();
    expect(component.currencyCode).toEqual('USD');
  }));

  it('should set suggestedBid and budget', fakeAsync(() => {
    component.budgetForm = campaignFormMock.get('budget') as FormGroup;
    component.ngOnInit();
    tick();
    expect(component.budgetForm.get('spendCap').value).toEqual(5);
    expect(component.budgetForm.get('budget').value).toEqual(10);
  }));

  it('should set suggestedBid and budget for LIFETIME budget', fakeAsync(() => {
    campaignFormMock.get('budget.budgetType').setValue(BudgetType.LIFETIME);
    component.budgetForm = campaignFormMock.get('budget') as FormGroup;
    component.ngOnInit();
    tick();
    expect(component.budgetForm.get('spendCap').value).toEqual(5);
    expect(component.budgetForm.get('budget').value).toEqual(10);
  }));

  it('should set the status', fakeAsync(() => {
    component.budgetForm = campaignFormMock.get('budget') as FormGroup;
    component.ngOnInit();
    tick();
    component.setCampaignStatusAndTriggerCampCreation(CampaignStatusType.ACTIVE);
    expect(component.budgetForm.parent.get('settings.status').value).toEqual('ACTIVE');
  }));

  it('should not update if value already exists', fakeAsync(() => {
    campaignFormMock.get('budget.budget').setValue(50);
    campaignFormMock.get('budget.spendCap').setValue(17);
    component.budgetForm = campaignFormMock.get('budget') as FormGroup;
    component.ngOnInit();
    tick();
    expect(component.budgetForm.get('spendCap').value).toEqual(17);
    expect(component.budgetForm.get('budget').value).toEqual(50);
  }));
});
