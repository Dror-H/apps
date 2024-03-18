import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BudgetType, currencies, CurrencyDetails } from '@instigo-app/data-transfer-object';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-facebook-budget-settings',
  templateUrl: './budget-settings.component.html',
  styleUrls: ['./budget-settings.component.scss'],
})
export class FacebookBudgetSettingsComponent implements OnInit, OnDestroy {
  @Input()
  budgetForm = new FormGroup({});

  @Output()
  setStep = new EventEmitter<void>();

  public currencyInfo: CurrencyDetails;
  public currencyCode: string;
  public parentForm: FormGroup;
  public budgetType = BudgetType;

  private subSink = new SubSink();

  private get campaignSettings(): FormGroup {
    return this.budgetForm.parent.get('settings') as FormGroup;
  }

  public currencyParse = (value: string) => value.replace('$', '');
  public currencyFormat = (value: number) =>
    `${this.currencyInfo.Symbol} ${(Math.round(value * 100) / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;

  ngOnInit(): void {
    this.parentForm = this.budgetForm.parent as FormGroup;

    this.currencyCode = this.campaignSettings.value.account.currency as string;
    this.currencyInfo = currencies.find((item: CurrencyDetails) => item.Code === this.currencyCode) as CurrencyDetails;
    this.budgetForm.get('budget').setValidators(Validators.max(this.currencyInfo.SubunitLimit));

    this.listenOnDayPartingAndUpdateAdsetSchedule();
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private listenOnDayPartingAndUpdateAdsetSchedule() {
    this.subSink.sink = this.budgetForm.controls.useDayparting.valueChanges.subscribe(() => {
      this.budgetForm.controls.adSetSchedule.setValue({});
    });
  }
}
