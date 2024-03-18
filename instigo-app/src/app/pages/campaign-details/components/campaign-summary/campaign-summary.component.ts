import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { CampaignsViewService } from '@app/pages/campaigns/campaigns-view.service';
import { QuickActionsService } from '@app/pages/campaigns/quick-actions.service';
import { DaypartingComponent } from '@app/pages/new-campaign/facebook-new-campaign/components/budget-settings/dayparting/dayparting.component';
import {
  AdSetDTO,
  BudgetType,
  CampaignDTO,
  CampaignStatusType,
  currencies,
  FacebookBidStrategyEnum,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import PromisePool from '@supercharge/promise-pool';
import to from 'await-to-js';
import { differenceInCalendarDays, format, parseJSON } from 'date-fns';
import { uniqBy } from 'lodash-es';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ClipboardService } from 'ngx-clipboard';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, map, skip, take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { DeliverySettingsCampaignEditComponent } from './delivery-settings-campaign-edit/delivery-settings-campaign-edit.component';

@Component({
  selector: 'ingo-campaign-summary',
  templateUrl: './campaign-summary.component.html',
  styleUrls: ['./campaign-summary.component.scss'],
  providers: [CampaignsViewService, QuickActionsService],
})
export class CampaignSummaryComponent implements OnInit, OnDestroy {
  @Input()
  selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }>;

  @Input()
  campaignAdSets$: BehaviorSubject<any>;

  public linkedinRemainingBudget: number | string = null;
  public summarizedCampaign: CampaignDTO;
  public unifiedDateFormat = "E, LLL do yyyy '/' hh:mma";
  public campEditForm: FormGroup;
  public editableFields: any;
  public currencyInfo;
  public currencyCode;
  public minBudget;
  public minSpendCap = 100.0;
  public isSelectedEndDateEmittable$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public budgetFormForAdSetSchedule: FormGroup;
  public deliverySettingsForm: FormGroup;
  public campaignStatusLoading = false;

  private subscription = new SubSink();
  private adSets: AdSetDTO[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private _clipboardService: ClipboardService,
    private displayNotification: DisplayNotification,
    private readonly quickActionsService: QuickActionsService,
    private modalService: NzModalService,
  ) {}

  public _linkedinSpendToday = null;

  @Input()
  set linkedinSpendToday(linkedinSpendToday: number) {
    this._linkedinSpendToday = linkedinSpendToday;
  }

  public get isUnderMinBudget(): boolean {
    return this.campEditForm.get('budget').value && this.campEditForm.get('budget').value < this.minBudget;
  }

  public get isUnderMinSpendCap(): boolean {
    return this.campEditForm.get('spendCap').value && this.campEditForm.get('spendCap').value < this.minSpendCap;
  }

  ngOnInit(): void {
    this.editableFields = {
      name: false,
      stopTime: false,
      budget: false,
      spendCap: false,
      adSetSchedule: false,
    };

    this.campEditForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      stopTime: [null, [Validators.required]],
      budget: [null, [Validators.required]],
      spendCap: [null, [Validators.required]],
    });

    this.budgetFormForAdSetSchedule = this.formBuilder.group({
      adSetSchedule: [null, [Validators.required]],
      previousAdSetScheduleValue: [null],
      adSetName: [null],
      adSetId: [null, [Validators.required]],
      adSetProviderId: [null, [Validators.required]],
    });

    this.deliverySettingsForm = this.formBuilder.group({
      optimizedFor: [null],
      bidStrategy: [FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP],
      costCap: [0.01, [Validators.min(0.01), Validators.required]],
      billingEvent: [null],
      conversion: this.addConversionToDelivery(),
      reach: this.addReachToDelivery(),
    });

    this.subscription.sink = this.selectedCampaign$
      .pipe(
        tap((res) => {
          if (res?.value) {
            res.value.provider === 'linkedin' ? this.prepareCampaignValues(res.value) : this.getAdSets(res.value);
            this.currencyCode = res.value.adAccount.currency;
            this.currencyInfo = currencies.find((item) => item.Code === this.currencyCode);
            this.campEditForm.controls.budget.setValidators(Validators.max(this.currencyInfo.SubunitLimit));
            this.minBudget = this.calculateMinBudget(res.value);
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public currencyParse = (value: string) => value.replace('$', '');

  public currencyFormat = (value: number) =>
    `${this.currencyInfo.Symbol} ${(Math.round(value * 100) / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;

  public toggleEdit(controlName: string): void {
    this.editableFields[controlName] = !this.editableFields[controlName];
  }

  public changeStatus(): void {
    const status =
      this.summarizedCampaign.status === CampaignStatusType.ACTIVE
        ? CampaignStatusType.PAUSED
        : CampaignStatusType.ACTIVE;
    this.campaignStatusLoading = true;
    this.quickActionsService
      .changeCampaignsStatus({ campaigns: [this.summarizedCampaign], status })
      .pipe(take(1))
      .subscribe(
        () => {
          this.campaignStatusLoading = false;
          this.summarizedCampaign.status = status;
        },
        () => {
          this.campaignStatusLoading = false;
        },
      );
  }

  public submitEdit(controlName: string) {
    const editedControl = this.campEditForm.controls[controlName];

    if (!editedControl.value) {
      return (this.editableFields[controlName] = false);
    }

    const campaign = {
      id: this.summarizedCampaign.id,
      providerId: this.summarizedCampaign.providerId,
      provider: this.summarizedCampaign.provider,
      name: this.summarizedCampaign.name,
      budget: this.summarizedCampaign.budget,
      budgetType: this.summarizedCampaign.budgetType,
      spendCap: this.summarizedCampaign.spendCap,
      budgetRemaining: this.summarizedCampaign.budgetRemaining,
    };

    const spendToday = campaign.budget - campaign.budgetRemaining;

    if (editedControl.valid) {
      campaign[controlName] = editedControl.value;
      campaign.budgetRemaining = Math.max(0, campaign.budget - spendToday);

      // TODO: What's this? It's a heck? For what?
      if (editedControl.value === 922337203685478) {
        this.campEditForm.get('spendCap').patchValue(null);
      }

      const payload = {
        id: campaign.id,
        providerId: campaign.providerId,
        provider: campaign.provider,
        [controlName]: campaign[controlName],
      };
      return this.quickActionsService
        .updateCampaignFields({ campaigns: [payload] })
        .pipe(
          tap(() => {
            this.summarizedCampaign[controlName] = editedControl.value;
            this.summarizedCampaign.budgetRemaining = campaign.budgetRemaining;

            this.campEditForm.reset();
            this.campEditForm.markAsPristine();
            this.campEditForm.updateValueAndValidity();

            const message = `app.campDetails.campUpdate.${controlName}Updated`;
            this.displayNotification.displayNotification(
              new Notification({
                titleId: message,
                type: NotificationType.SUCCESS,
              }),
            );
            this.editableFields[controlName] = false;
          }),
          catchError(() => {
            const message = `app.campDetails.campUpdate.${controlName}FailedUpdate`;
            this.displayNotification.displayNotification(
              new Notification({
                titleId: message,
                type: NotificationType.ERROR,
              }),
            );
            return EMPTY;
          }),
        )
        .toPromise();
    } else {
      const message = `app.campDetails.campUpdate.${controlName}FailedUpdate`;
      this.displayNotification.displayNotification(
        new Notification({ titleId: message, type: NotificationType.ERROR }),
      );
    }
  }

  public submitStopTime() {
    this.isSelectedEndDateEmittable$.next(true);
  }

  public async editStopTime(date: Date): Promise<void> {
    this.isSelectedEndDateEmittable$.next(false);
    this.campEditForm.controls.stopTime.setValue(date);
    switch (this.summarizedCampaign.provider) {
      case SupportedProviders.LINKEDIN:
        await this.submitEdit('stopTime');
        break;
      case SupportedProviders.FACEBOOK:
        await this.editEndTimeForFacebookAdSets();
        break;
      default:
        console.log('No provider');
        break;
    }
  }

  public openEditDeliverySettingsModal(): void {
    this.modalService.create({
      nzTitle: `Delivery and optimization`,
      nzContent: DeliverySettingsCampaignEditComponent,
      nzComponentParams: {
        deliverySettings: this.deliverySettingsForm,
        adAccount: this.summarizedCampaign.adAccount,
        objective: this.summarizedCampaign.objective,
      },
      nzWidth: 800,
      nzOkText: 'Save changes',
      nzOkType: 'primary',
      nzOnOk: () => this.submitEditDeliverySettings(),
    });
  }

  private async submitEditDeliverySettings(): Promise<void> {
    const deliverySettingsFormValue = this.deliverySettingsForm.value;
    const { results, errors } = await new PromisePool()
      .for(this.adSets)
      .withConcurrency(5)
      .process(async (adSet: AdSetDTO) => {
        const payload = {
          id: adSet.id,
          providerId: adSet.providerId,
          provider: SupportedProviders.FACEBOOK,
          optimizationGoal: deliverySettingsFormValue.optimizedFor,
          bidStrategy: deliverySettingsFormValue.bidStrategy,
          bidAmount: deliverySettingsFormValue.costCap,
          billingEvent: deliverySettingsFormValue.billingEvent,
          conversionEvents: deliverySettingsFormValue.conversion?.conversionEvents,
          conversionPixel: deliverySettingsFormValue.conversion?.conversionPixel,
          intervalDays: deliverySettingsFormValue.reach?.intervalDays,
          maxFrequency: deliverySettingsFormValue.reach?.maxFrequency,
        };
        const [err, result] = await to(this.editAdSet({ payload, controlName: 'deliverySettings' }));
        if (err) {
          return err;
        }
        if (result) {
          this.summarizedCampaign.billingEvent = deliverySettingsFormValue.billingEvent;
          return result;
        }
      });
    return;
  }

  public editAdSetSchedule() {
    this.modalService.create({
      nzTitle: `View schedule of ad set: ${this.budgetFormForAdSetSchedule.controls.adSetName.value}`,
      nzContent: DaypartingComponent,
      nzComponentParams: { budgetSettingsForm: this.budgetFormForAdSetSchedule },
      nzWidth: 800,
      nzOkText: 'Save changes',
      nzOkType: 'primary',
      nzOnOk: () => this.submitEditAdSetSchedule(),
    });
  }

  public removeSpendCap() {
    this.campEditForm.get('spendCap').patchValue(922337203685478);
    this.submitEdit('spendCap');
  }

  public getAdSets(campaign: CampaignDTO): void {
    this.subscription.add(
      this.campaignAdSets$
        .pipe(
          skip(1),
          map((result) => result),
        )
        .subscribe((adSets) => {
          this.adSets = adSets;
          this.prepareCampaignValues(campaign, adSets);
        }),
    );
  }

  public parseSpecialCats(catsObject): string {
    let catsOutput = (catsObject.match(/"\w+"/g) || []).map((v) => v.replaceAll('"', '').replaceAll('_', ' '));
    return catsOutput.length > 0 ? catsOutput.join(', ') : 'None';
  }

  public copyCellContent(value: string): void {
    this._clipboardService.copyFromContent(value);
    this.displayNotification.displayNotification(
      new Notification({ titleId: 'app.campDetails.campSummary.campaignId', type: NotificationType.INFO }),
    );
  }

  private async editEndTimeForFacebookAdSets(): Promise<any> {
    const controlName = 'stopTime';
    const editedControl = this.campEditForm.controls[controlName];

    if (!editedControl.value) {
      return (this.editableFields[controlName] = false);
    }
    if (this.adSets.length > 0) {
      const { results, errors } = await new PromisePool()
        .for(this.adSets)
        .withConcurrency(5)
        .process(async (adSet: AdSetDTO) => {
          const payload = {
            id: adSet.id,
            providerId: adSet.providerId,
            provider: adSet.provider,
            endTime: this.campEditForm.controls['stopTime'].value,
            timezoneName: this.summarizedCampaign.adAccount.timezoneName,
          };
          const [err, result] = await to(this.editAdSet({ payload, controlName }));
          if (err) {
            throw err;
          }
          this.summarizedCampaign[controlName] = this.campEditForm.controls['stopTime'].value
            ? format(parseJSON(this.campEditForm.controls['stopTime'].value), this.unifiedDateFormat)
            : 'Not Set';
          return result;
        });
      this.editableFields[controlName] = false;
      return results;
    }
    const message = 'app.campDetails.campUpdate.noAdSetFailedUpdate';
    this.displayNotification.displayNotification(new Notification({ titleId: message, type: NotificationType.ERROR }));
    this.editableFields[controlName] = false;
    return Promise.resolve([]);
  }

  private async submitEditAdSetSchedule(): Promise<void> {
    if (
      this.budgetFormForAdSetSchedule.controls.adSetSchedule.value !==
      this.budgetFormForAdSetSchedule.controls.previousAdSetScheduleValue.value
    ) {
      const availableAdSets = this.adSets.filter((adSet) => adSet.budgetType === BudgetType.LIFETIME);
      const { results, errors } = await new PromisePool()
        .for(availableAdSets)
        .withConcurrency(5)
        .process(async (adSet: AdSetDTO) => {
          const payload = {
            id: this.budgetFormForAdSetSchedule.controls.adSetId.value,
            providerId: this.budgetFormForAdSetSchedule.controls.adSetProviderId.value,
            provider: SupportedProviders.FACEBOOK,
            adSetSchedule: this.budgetFormForAdSetSchedule.controls.adSetSchedule.value,
            dayParting: 'On',
          };
          const [err, result] = await to(this.editAdSet({ payload, controlName: 'adSetSchedule' }));
          if (err) {
            this.budgetFormForAdSetSchedule.patchValue({
              adSetSchedule: this.budgetFormForAdSetSchedule.controls.previousAdSetScheduleValue,
            });
            return err;
          }
          if (result) {
            this.summarizedCampaign.dayParting = 'On';
            return result;
          }
        });
      return;
    }
    return;
  }

  private editAdSet(options: { payload: Partial<AdSetDTO>; controlName: string }): Promise<any> {
    const { payload, controlName } = options;
    return this.quickActionsService
      .updateAdSetFields({ adSets: [payload] })
      .pipe(
        tap(() => {
          const message = `app.campDetails.campUpdate.${controlName}AdSetUpdated`;

          this.displayNotification.displayNotification(
            new Notification({
              titleId: message,
              type: NotificationType.SUCCESS,
            }),
          );
        }),
        catchError((error) => {
          this.displayNotification.displayNotification(
            new Notification({
              title: error?.error?.error?.title,
              content: error?.error?.error?.description,
              type: NotificationType.ERROR,
            }),
          );
          return EMPTY;
        }),
      )
      .toPromise();
  }

  private getNewestEndTimeFromAdSets(adSets: AdSetDTO[]): Date {
    const beginning = new Date('January 1, 1970, 00:00:00 UTC');
    const newest = adSets.reduce((acc, adSet) => {
      if (!adSet.endTime) {
        return acc;
      }
      return Date.parse(adSet.endTime.toString()) > Date.parse(acc.toString()) ? adSet.endTime : acc;
    }, beginning);
    return newest !== beginning ? newest : null;
  }

  private getOldestStartTimeFromAdSets(adSets: AdSetDTO[]): Date {
    const ending = new Date('January 1, 3970, 00:00:00 UTC');
    const oldest = adSets.reduce((acc, adSet) => {
      if (!adSet.startTime) {
        return acc;
      }
      return Date.parse(adSet.startTime.toString()) < Date.parse(acc.toString()) ? adSet.startTime : acc;
    }, ending);
    return oldest !== ending ? oldest : null;
  }

  private getFirstAdSetThatHasLifetimeBudget(adSets: AdSetDTO[]): AdSetDTO {
    return adSets.find((adSet) => adSet.budgetType === BudgetType.LIFETIME);
  }

  private setDependingFieldsOnCampaignForFacebook(campaign: CampaignDTO, adSets?: AdSetDTO[]) {
    campaign.startTime =
      campaign.startTime && Date.parse(campaign.startTime.toString()) > Date.parse('January 10, 1970, 00:00:00 UTC')
        ? campaign.startTime
        : this.getOldestStartTimeFromAdSets(adSets);
    campaign.startTime = campaign.startTime ? format(parseJSON(campaign.startTime), this.unifiedDateFormat) : 'Not Set';

    const newestEndTimeFromAdSets = this.getNewestEndTimeFromAdSets(adSets);
    campaign.stopTime = newestEndTimeFromAdSets
      ? format(parseJSON(newestEndTimeFromAdSets), this.unifiedDateFormat)
      : 'Not Set';

    campaign.budgetType = adSets.find((adSet) => adSet.budgetType === BudgetType.LIFETIME)
      ? BudgetType.LIFETIME
      : BudgetType.DAILY;
    const potentialAdSetWithAdSetSchedule = this.getFirstAdSetThatHasLifetimeBudget(adSets);
    if (potentialAdSetWithAdSetSchedule) {
      this.budgetFormForAdSetSchedule.setValue({
        adSetSchedule: potentialAdSetWithAdSetSchedule.adSetSchedule || {},
        previousAdSetScheduleValue: potentialAdSetWithAdSetSchedule.adSetSchedule,
        adSetName: potentialAdSetWithAdSetSchedule.name,
        adSetId: potentialAdSetWithAdSetSchedule.id,
        adSetProviderId: potentialAdSetWithAdSetSchedule.providerId,
      });
    }
  }

  private prepareCampaignValues(campaign: CampaignDTO, adSets?: AdSetDTO[]): void {
    if (campaign.provider === 'linkedin') {
      if (campaign.budget) {
        if (campaign.budgetType === (BudgetType.DAILY || BudgetType.DAILY_WITH_MAX)) {
          this.linkedinRemainingBudget = Number((campaign.budget - this._linkedinSpendToday).toFixed(2));
        } else {
          this.linkedinRemainingBudget = Number((campaign.budget - campaign.insights.summary.spend).toFixed(2));
        }
      }
    }

    const result = adSets || this.campaignAdSets$.value;
    campaign.specialCats = campaign.specialCats ? this.parseSpecialCats(campaign.specialCats) : 'Not Used';
    campaign['created'] = format(parseJSON(campaign.createdAt), this.unifiedDateFormat);
    campaign['updated'] = format(parseJSON(campaign.updatedAt), this.unifiedDateFormat);
    if (campaign.provider === SupportedProviders.FACEBOOK) {
      this.setDependingFieldsOnCampaignForFacebook(campaign, adSets);
    } else {
      campaign.startTime = format(parseJSON(campaign.startTime), this.unifiedDateFormat);
      campaign.stopTime = campaign.stopTime ? format(parseJSON(campaign.stopTime), this.unifiedDateFormat) : 'Not Set';
    }

    const findDayParting: AdSetDTO[] = uniqBy(result, 'dayParting') as any;
    const findBillingEvent = uniqBy(result, 'billingEvent');
    // TODO: ask why do we have dayParting on campaigns in db?
    campaign.dayParting =
      findDayParting.length === 1
        ? findDayParting[0].dayParting
        : result.map((d) => ({ name: d.name, value: d.dayParting }));
    campaign.budgetRemaining = campaign.budgetRemaining
      ? campaign.budgetRemaining
      : result.map((d) => ({ name: d.name, value: d.budgetRemaining }));
    campaign.budget =
      campaign.provider === 'linkedin'
        ? campaign.budget
          ? campaign.budget
          : null
        : campaign.budget
        ? campaign.budget
        : result.map((d) => ({ name: d.name, value: d.budget, type: d.budgetType }));
    campaign.billingEvent =
      campaign.provider === 'linkedin'
        ? campaign.billingEvent
        : findBillingEvent.length === 1
        ? result[0]?.billingEvent?.replace('_', ' ')
        : result.map((d) => ({ name: d.name, value: d.billingEvent.replace('_', ' ') }));
    campaign.spendCap = !campaign.spendCap || campaign.spendCap === 922337203685478 ? null : campaign.spendCap;
    this.summarizedCampaign = campaign;
  }

  private calculateMinBudget(campaign: Partial<CampaignDTO>): number {
    const { budgetType, startTime, stopTime } = campaign;
    const minDailyBudget = campaign.adAccount.minDailyBudget.minDailyBudgetImp;
    if (budgetType === 'lifetime' && stopTime) {
      const diffTimeInDays = differenceInCalendarDays(new Date(stopTime), new Date(startTime));
      return (minDailyBudget * diffTimeInDays) / 100;
    } else {
      return minDailyBudget / 100;
    }
  }

  private addConversionToDelivery(): FormGroup {
    const newConversionForm = this.formBuilder.group({
      conversionEvents: ['PURCHASE', [Validators.required]],
      conversionPixel: [null, [Validators.required]],
    });
    newConversionForm.disable();
    return newConversionForm;
  }

  private addReachToDelivery(): FormGroup {
    const newReachForm = this.formBuilder.group({
      intervalDays: [1, [Validators.required, Validators.min(1), Validators.max(90)]],
      maxFrequency: [7, [Validators.required, Validators.min(1), Validators.max(90)]],
    });
    newReachForm.disable();
    return newReachForm;
  }
}
