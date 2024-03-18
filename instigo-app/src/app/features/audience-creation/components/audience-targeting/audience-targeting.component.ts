import { Component, EventEmitter, Input, OnDestroy, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import { AudienceSubType, AudienceType, SupportedProviders, TargetingDto } from '@instigo-app/data-transfer-object';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-audience-targeting',
  templateUrl: './audience-targeting.component.html',
  styleUrls: ['audience-targeting.component.scss'],
})
export class AudienceTargetingComponent implements OnInit, OnDestroy {
  @Input() audienceForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();

  public isCustomAudienceFormValid = false;
  public existingRules: TargetingDto;

  public audienceType = AudienceType;
  private subscriptions = new SubSink();

  constructor(private adAccountApiService: AdAccountApiService, private modal: NzModalService) {}

  ngOnInit(): void {
    this.setExistingRules();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public validateForm($event: boolean): void {
    setTimeout(() => {
      this.isCustomAudienceFormValid = $event;
    });
  }

  public checkTosAndContinue(): void {
    if (
      this.audienceForm.value.provider === SupportedProviders.FACEBOOK &&
      this.audienceForm.value.audienceType === AudienceType.CUSTOM_AUDIENCE &&
      this.audienceForm.value.audienceSubType === AudienceSubType.LIST
    ) {
      this.checkIfCustomAudienceListHasTOS();
    } else {
      this.setStep.emit(2);
    }
  }

  private checkIfCustomAudienceListHasTOS() {
    const adAccountProviderId: string = this.audienceForm.value.adAccount.providerId;
    this.adAccountApiService
      .checkAdAccountTos({ providerId: adAccountProviderId })
      .subscribe((res: { tos_accepted: { custom_audience_tos: number } }) => {
        if (res.tos_accepted?.custom_audience_tos === 1) {
          this.setStep.emit(2);
        } else {
          const tosLink = this.getTOSLink(adAccountProviderId);
          this.modal.confirm({
            nzTitle: '<i>Accept terms of service</i>',
            nzContent: `<p>Before continue, you have to accept the terms of service on Facebook.</p>`,
            nzOkText: 'Take me there',
            nzCancelText: 'Later',
            nzOnOk: () => window.open(tosLink, '_blank'),
          });
        }
      });
  }

  private getTOSLink(providerId: string): string {
    return `https://business.facebook.com/ads/manage/customaudiences/tos/?act=${providerId.substring(4)}`;
  }

  private setExistingRules(): void {
    this.existingRules = this.audienceForm.get('target').value;
  }
}
