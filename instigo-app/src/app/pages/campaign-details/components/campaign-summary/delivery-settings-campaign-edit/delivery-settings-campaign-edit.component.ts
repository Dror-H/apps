import { getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import {
  biddingStrategies,
  conversionEvents,
  facebookCampaignObjectives,
  optimizationGoals,
} from '@app/pages/new-campaign/facebook-new-campaign/facebook-new-campaign.data';
import { AdAccountDTO, FacebookBidStrategyEnum, SupportedProviders } from '@instigo-app/data-transfer-object';
import { startCase } from 'lodash-es';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { filter, map, mergeMap, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-delivery-settings-campaign-edit',
  templateUrl: './delivery-settings-campaign-edit.component.html',
  styleUrls: ['./delivery-settings-campaign-edit.component.scss'],
})
export class DeliverySettingsCampaignEditComponent implements OnInit, OnDestroy {
  @Input() deliverySettings = new FormGroup({});
  @Input() adAccount: Partial<AdAccountDTO> = null;
  @Input() objective: string = null;
  @Output() createCampaign = new EventEmitter<void>();

  public optimizationGoals = [];
  public billingEvents = [];
  public biddingStrategies = JSON.parse(JSON.stringify(biddingStrategies));
  public conversionEvents = conversionEvents.map((item) => ({
    label: startCase(item),
    value: item,
  })) as NzSelectOptionInterface[];
  public pixels: { label: string; isUnavailable: boolean; value: string }[];
  public hasPixels: boolean = false;
  public facebookBidStrategyEnum = FacebookBidStrategyEnum;
  public isOffsiteConversions = false;
  public isAcceleratedDeliveryEnabled = false;
  public currency: { symbol: string; code: string };
  private subSink = new SubSink();

  constructor(public audienceApiService: AudienceApiService) {}

  private get costCap(): FormControl {
    return this.deliverySettings.get('costCap') as FormControl;
  }

  ngOnInit() {
    const campaignObjective = facebookCampaignObjectives.find((item) => item.value === this.objective);
    this.selectDefaultOptimizationGoal();

    this.isOffsiteConversionsAndGetPixels(campaignObjective);
    this.setTargetOptimizations();
    this.setBillingEventList();
    this.listenOnBidStrategyAndChangeAcceleratedDelivery();
    this.deliverySettings.controls.bidStrategy.valueChanges.subscribe((change) => {
      this.setCostCapDependsOnBidStrategy(change);
    });
    this.setCostCapDependsOnBidStrategy(this.deliverySettings.controls.bidStrategy.value);
    this.restrictBidStrategiesAccordingToCampaignObjective(campaignObjective);
    this.setCurrencyAndSymbol();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private selectDefaultOptimizationGoal(): void {
    const campaignObjective = facebookCampaignObjectives.find((item) => item.value === this.objective);
    this.deliverySettings.get('optimizedFor').setValue(campaignObjective.defaultOptimizationGoal);
    if (campaignObjective.defaultOptimizationGoal === 'OFFSITE_CONVERSIONS') {
      this.deliverySettings.get('conversion').enable();
    } else {
      this.deliverySettings.get('conversion').disable();
    }
    this.subSink.sink = this.deliverySettings
      .get('optimizedFor')
      .valueChanges.pipe(startWith(this.deliverySettings.get('optimizedFor').value))
      .subscribe((value) => {
        if (value) {
          this.deliverySettings
            .get('billingEvent')
            .setValue(optimizationGoals.find((item) => item.id === value).billingEvents[0].id);
          if (value === 'REACH') {
            this.deliverySettings.get('reach').enable();
          } else {
            this.deliverySettings.get('reach').disable();
          }
        }
      });
    this.deliverySettings.get('bidStrategy').setValue(biddingStrategies[0].id);
  }

  private setCurrencyAndSymbol(): void {
    this.currency = { code: this.adAccount.currency, symbol: getCurrencySymbol(this.adAccount.currency, 'narrow') };
  }

  private setCostCapDependsOnBidStrategy(bidStrategy: FacebookBidStrategyEnum) {
    this.isAcceleratedDeliveryEnabled = false;
    switch (bidStrategy) {
      case FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP:
        this.resetCostCapAndRemoveValidators();
        break;
      case FacebookBidStrategyEnum.LOWEST_COST_WITH_BID_CAP:
        this.resetCostCapToDefaultAndSetValidators();
        this.isAcceleratedDeliveryEnabled = this.costCap.value > 0;
        break;
      default:
        this.resetCostCapToDefaultAndSetValidators();
    }
  }

  private resetCostCapToDefaultAndSetValidators(): void {
    this.costCap.setValue(0.01);
    this.costCap.setValidators([Validators.required, Validators.min(0.01)]);
    this.costCap.updateValueAndValidity();
  }

  private resetCostCapAndRemoveValidators(): void {
    this.deliverySettings.get('costCap').reset();
    this.costCap.clearValidators();
    this.costCap.updateValueAndValidity();
  }

  private setTargetOptimizations(): void {
    const campaignOptimizationValue = this.objective;
    this.optimizationGoals = optimizationGoals.filter((item) => item.enabledFor.includes(campaignOptimizationValue));
  }

  private setBillingEventList(): void {
    this.billingEvents = optimizationGoals.find(
      (item) => item.id === this.deliverySettings.get('optimizedFor').value,
    ).billingEvents;

    this.subSink.sink = this.deliverySettings.get('optimizedFor').valueChanges.subscribe((value) => {
      this.billingEvents = optimizationGoals.find((item) => item.id === value).billingEvents;
      this.deliverySettings.get('billingEvent').setValue(this.billingEvents[0].id);
    });
  }

  private listenOnBidStrategyAndChangeAcceleratedDelivery(): void {
    this.subSink.sink = this.deliverySettings
      .get('bidStrategy')
      .valueChanges.pipe(
        mergeMap((deliverySettings) => {
          if (deliverySettings !== 'LOWEST_COST_WITH_BID_CAP') {
            this.deliverySettings.get('acceleratedDelivery').setValue(false);
          }
          return this.deliverySettings.get('costCap').valueChanges.pipe(
            filter((changes) => changes <= 0),
            map(() => this.deliverySettings.get('acceleratedDelivery').setValue(false)),
          );
        }),
      )
      .subscribe();
  }

  private getPixels(): void {
    if (this.adAccount?.providerId) {
      this.audienceApiService
        .findAllTrackers({
          adAccountProviderId: this.adAccount.providerId,
          provider: SupportedProviders.FACEBOOK,
        })
        .pipe(
          map((items) =>
            items.map((item) => ({
              value: item.providerId,
              label: item.name,
              isUnavailable: item.isUnavailable,
            })),
          ),
        )
        .subscribe((item) => {
          this.pixels = item;
          if (this.pixels?.length > 0) {
            this.deliverySettings.get('conversion.conversionPixel').setValue(this.pixels[0].value);
            this.hasPixels = true;
          }
        });
    }
  }

  private isOffsiteConversionsAndGetPixels(campaignObjective: any): void {
    if (campaignObjective.defaultOptimizationGoal === 'OFFSITE_CONVERSIONS') {
      this.isOffsiteConversions = true;
      this.getPixels();
    }
  }

  private restrictBidStrategiesAccordingToCampaignObjective(campaignObjective: any) {
    switch (campaignObjective.value) {
      case 'CONVERSIONS': {
        this.isOffsiteConversions = true;
        this.getPixels();
        break;
      }
      case 'BRAND_AWARENESS': {
        this.biddingStrategies = this.biddingStrategies.map((item) => ({
          ...item,
          disabled:
            item.id != FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP
              ? (item.disabled = true)
              : (item.disabled = false),
        }));
        break;
      }
      case 'REACH': {
        this.biddingStrategies = this.biddingStrategies.map((item) => ({
          ...item,
          disabled: item.id == FacebookBidStrategyEnum.COST_CAP ? (item.disabled = true) : (item.disabled = false),
        }));
        break;
      }
    }
  }
}
