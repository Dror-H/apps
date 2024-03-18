import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdSetApiService } from '@app/api/services/ad-set.api.service';
import { AdApiService } from '@app/api/services/ad.api.service';
import { AdTemplateEditModalComponent } from '@app/features/ad-template-operation/modules/ad-template-edit-modal/ad-template-edit-modal.component';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { CampaignsViewService } from '@app/pages/campaigns/campaigns-view.service';
import { QuickActionsService } from '@app/pages/campaigns/quick-actions.service';
import {
  AdDTO,
  AdSetDTO,
  AdTemplateBase,
  CampaignDTO,
  CampaignStatusType,
  currencies,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { differenceInCalendarDays } from 'date-fns';
import { mapValues } from 'lodash-es';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { catchError, map, skip, switchMap, take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { adSetsTableConfig, AdsetsTableConfigInterface } from './adsets-table.config';

@Component({
  selector: 'ingo-campaign-adsets-table',
  templateUrl: './campaign-adsets-table.component.html',
  providers: [CampaignsViewService, QuickActionsService],
})
export class CampaignAdsetsTableComponent implements OnInit, OnDestroy {
  @Input()
  selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }>;

  @Input()
  campaignAdSets$: BehaviorSubject<any>;

  public accountCurrency: string;
  public allAdSets$: BehaviorSubject<AdSetDTO[]> = new BehaviorSubject(null);
  public adSetsTableConfig: AdsetsTableConfigInterface[] = adSetsTableConfig;
  public adSetsEditForm: FormGroup = new FormGroup({});
  public editableFields: any = {};
  public currencyInfo;
  public currencyCode;
  public minBudget;

  private subscription = new SubSink();

  constructor(
    public formBuilder: FormBuilder,
    private readonly adSetApiService: AdSetApiService,
    private readonly adApiService: AdApiService,
    private readonly displayNotification: DisplayNotification,
    private readonly quickActionsService: QuickActionsService,
    private readonly modalService: NzModalService,
  ) {}

  public get isUnderMinBudget(): boolean {
    const activeField = Object.keys(this.editableFields).find((key) => this.editableFields[key] === true);
    return this.adSetsEditForm.get(activeField).value && this.adSetsEditForm.get(activeField).value < this.minBudget;
  }

  ngOnInit(): void {
    this.subscription.sink = this.selectedCampaign$
      .pipe(
        tap((res) => {
          if (res?.value) {
            this.currencyCode = res.value.adAccount.currency;
            this.currencyInfo = currencies.find((item) => item.Code === this.currencyCode);
            this.minBudget = this.calculateMinBudget(res.value);
          }
        }),
      )
      .subscribe();

    this.campaignAdSets$
      .pipe(
        skip(1),
        map((result) => result),
      )
      .subscribe((result) => {
        this.allAdSets$.next(result);
        this.initializeEditForm(result);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public currencyParse = (value: string) => value.replace('$', '');

  public currencyFormat = (value: number) =>
    `${this.currencyInfo.Symbol} ${(Math.round(value * 100) / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;

  public toggleEdit(controlId: string, fieldType: string): void {
    this.adSetsEditForm.reset();
    this.adSetsEditForm.markAsPristine();
    this.adSetsEditForm.updateValueAndValidity();
    this.editableFields = mapValues(this.editableFields, () => false);
    this.editableFields[`${controlId}-${fieldType}`] = !this.editableFields[`${controlId}-${fieldType}`];
  }

  public submitEdit(controlId: string, fieldType: string) {
    const editedControl = this.adSetsEditForm.controls[`${controlId}-${fieldType}`];
    if (!editedControl.value) {
      return (this.editableFields[`${controlId}-${fieldType}`] = false);
    }

    if (editedControl.valid) {
      const adSet = this.allAdSets$.value.find((adSet) => adSet.id === controlId);
      adSet[fieldType] = editedControl.value;
      const payload = {
        id: adSet.id,
        providerId: adSet.providerId,
        provider: adSet.provider,
        budgetType: adSet.budgetType,
        [fieldType]: adSet[fieldType],
      };
      return this.quickActionsService
        .updateAdSetFields({ adSets: [payload] })
        .pipe(
          tap(() => {
            this.adSetsEditForm.reset();
            this.adSetsEditForm.markAsPristine();
            this.adSetsEditForm.updateValueAndValidity();
            const message = `app.campDetails.campUpdate.${fieldType}AdSetUpdated`;

            this.displayNotification.displayNotification(
              new Notification({
                titleId: message,
                type: NotificationType.SUCCESS,
              }),
            );
            this.editableFields = mapValues(this.editableFields, () => false);
          }),
          catchError(() => {
            const message = `app.campDetails.campUpdate.${fieldType}AdSetFailedUpdate`;
            this.displayNotification.displayNotification(
              new Notification({ titleId: message, type: NotificationType.ERROR }),
            );
            return EMPTY;
          }),
        )
        .toPromise();
    } else {
      const message = `app.campDetails.campUpdate.adSetBudgetFailedUpdate`;
      this.displayNotification.displayNotification(
        new Notification({ titleId: message, type: NotificationType.ERROR }),
      );
    }
  }

  public changeStatus(item, type): void {
    const status = item.status === CampaignStatusType.ACTIVE ? CampaignStatusType.PAUSED : CampaignStatusType.ACTIVE;
    item['loading'] = true;
    const observable$ = (type) => {
      if (type === Resources.AD_SETS) {
        return this.adSetApiService.changeStatus({ adsets: [item], status });
      }
      if (type === Resources.ADS) {
        return this.adApiService.changeStatus({ ads: [item], status });
      }
    };
    observable$(type)
      .pipe(take(1))
      .subscribe(
        () => {
          item.status = status;
          item['loading'] = false;
        },
        () => {
          this.displayNotification.displayNotification(
            new Notification({
              content: `We failed to update the status`,
              type: NotificationType.ERROR,
            }),
          );
        },
      );
  }

  public previewFacebookCreative(previewId: string): string {
    const postUrl = previewId.split('_');
    return `https://facebook.com/${postUrl[0]}/posts/${postUrl[1]}`;
  }

  public openAdTemplateModal(ad: AdDTO): void {
    this.modalService
      .create({
        nzTitle: `Edit ad: ${ad.name}`,
        nzContent: AdTemplateEditModalComponent,
        nzComponentParams: {
          adTemplate: this.serializeAdTemplateDTO(ad),
        },
        nzWidth: 1300,
      })
      .afterClose.asObservable()
      .pipe(
        switchMap((result) => {
          if (result != null) {
            return this.adApiService.updateAd(result.payload);
          } else {
            return of(EMPTY);
          }
        }),
      )
      .subscribe((result) => {
        if (result != EMPTY) {
          window.location.reload();
        }
      });
  }

  private serializeAdTemplateDTO(ad: AdDTO): any {
    return {
      name: ad.name,
      adTemplateType: (ad.objectStorySpec as AdTemplateBase).adTemplateType,
      provider: SupportedProviders.FACEBOOK,
      adAccount: ad.adAccount,
      data: ad.objectStorySpec,
      id: ad.id,
      providerId: ad.providerId,
    };
  }

  private initializeEditForm(adSets): void {
    adSets.forEach((adSet) => {
      this.adSetsEditForm.addControl(`${adSet.id}-name`, new FormControl(null, [Validators.required]));
      this.adSetsEditForm.addControl(`${adSet.id}-budget`, new FormControl(null, [Validators.required]));
      this.editableFields[`${adSet.id}-name`] = false;
      this.editableFields[`${adSet.id}-budget`] = false;
    });
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
}
