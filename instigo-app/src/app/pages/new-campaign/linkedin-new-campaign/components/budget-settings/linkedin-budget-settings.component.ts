import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BudgetType,
  CampaignStatusType,
  currencies,
  CurrencyDetails,
  LinkedinBidSuggestionsDto,
  LinkedinCostType,
} from '@instigo-app/data-transfer-object';
import { linkedinCostTypeNzOptions } from '../../linkedin-new-campaign.data';
import { NewCampaignService } from '@app/pages/new-campaign/services/new-campaign.service';
import { mergeMap, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ingo-linkedin-budget-settings',
  templateUrl: './linkedin-budget-settings.component.html',
})
export class LinkedinBudgetSettingsComponent implements OnInit, OnDestroy {
  @Input() budgetForm = new FormGroup({});
  @Output() createCampaign = new EventEmitter();

  public currencyCode: string;
  public currencyInfo: CurrencyDetails;
  public parentForm: FormGroup;
  public campaignStatusType = CampaignStatusType;
  public linkedinCostType = linkedinCostTypeNzOptions.map((item) => ({
    ...item,
    disabled: item.value === LinkedinCostType.CPV,
  }));
  public budgetSuggestions: any;

  private subSink = new SubSink();

  constructor(private readonly newCampaignService: NewCampaignService) {}

  private get campaignSettings(): FormGroup {
    return this.parentForm.get('settings') as FormGroup;
  }

  private get status(): FormControl {
    return this.parentForm.get('settings.status') as FormControl;
  }

  public setCampaignStatusAndTriggerCampCreation(status: CampaignStatusType): void {
    this.status.setValue(status);
    this.createCampaign.emit();
  }

  ngOnInit(): void {
    this.parentForm = this.budgetForm.parent as FormGroup;
    this.currencyCode = this.campaignSettings.value.account.currency as string;
    this.currencyInfo = currencies.find((item: CurrencyDetails) => item.Code === this.currencyCode) as CurrencyDetails;
    this.budgetForm.get('budget').setValidators(Validators.max(this.currencyInfo.SubunitLimit));
    this.listenOnCostTypeAndFetchSuggestions();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private listenOnCostTypeAndFetchSuggestions(): void {
    this.subSink.sink = combineLatest([
      this.budgetForm.get('budgetType').valueChanges.pipe(startWith(this.budgetForm.get('budgetType').value)),
      this.budgetForm.get('costType').valueChanges.pipe(
        startWith(this.budgetForm.get('costType').value),
        mergeMap(() => this.newCampaignService.getLinkedinBidSuggestions(this.parentForm.value)),
      ),
    ]).subscribe(([type, budgetSuggestions]) => {
      if (type === BudgetType.DAILY) {
        this.budgetSuggestions = { ...budgetSuggestions, ...this.getBudgetDetailsForDailyBudget(budgetSuggestions) };
      } else {
        this.budgetSuggestions = {
          ...budgetSuggestions,
          ...this.getBudgetDetailsForLifetimeBudget(),
        };
      }
      this.setBudgetIfNull(budgetSuggestions);
      this.setBidIfNull(budgetSuggestions);
    });
  }

  private setBudgetIfNull(budgetSuggestions: LinkedinBidSuggestionsDto): void {
    if (this.budgetForm.get('budget').value == null) {
      this.budgetForm.get('budget').setValue(budgetSuggestions.dailyBudgetLimits.default.amount);
    }
  }

  private setBidIfNull(budgetSuggestions: LinkedinBidSuggestionsDto): void {
    if (this.budgetForm.get('spendCap').value == null) {
      this.budgetForm.get('spendCap').setValue(budgetSuggestions.suggestedBid.default.amount);
    }
  }

  private getBudgetDetailsForDailyBudget(budgetSuggestions: LinkedinBidSuggestionsDto) {
    return {
      minBudget: budgetSuggestions.dailyBudgetLimits.min.amount,
      maxBudget: budgetSuggestions.dailyBudgetLimits.max.amount,
      defaultBudget: budgetSuggestions.dailyBudgetLimits.default.amount,
    };
  }

  private getBudgetDetailsForLifetimeBudget() {
    return {
      minBudget: 0,
      maxBudget: this.currencyInfo.SubunitLimit,
      defaultBudget: 20,
    };
  }
}
