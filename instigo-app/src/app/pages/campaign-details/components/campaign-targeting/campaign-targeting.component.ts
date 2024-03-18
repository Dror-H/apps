import { Component, Input, OnInit } from '@angular/core';
import { AdAccountDTO, CampaignDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { BehaviorSubject, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { TargetingDisplay } from '@app/global/constants';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { CampaignTargetingEditComponent } from '@app/pages/campaign-details/components/campaign-targeting/campaign-targeting-edit-modal/campaign-targeting-edit.component';

@Component({
  selector: 'ingo-campaign-targeting',
  templateUrl: './campaign-targeting.component.html',
  styleUrls: ['./campaign-targeting.component.scss'],
})
export class CampaignTargetingComponent implements OnInit {
  @Input()
  selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }>;

  @Input()
  campaignAdSets$: BehaviorSubject<any>;

  @SelectSnapshot(WorkspaceState.adAccountsList)
  adAccountsList: AdAccountDTO[];

  public campaignTargeting: TargetingDisplay[] = [];

  private subscription = new SubSink();

  constructor(private service: CampaignApiService, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.subscription.sink = this.selectedCampaign$
      .pipe(mergeMap((res) => (res?.value ? this.getTargetings(res.value) : of(null))))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public editTargeting(target: TargetingDisplay): void {
    target.adAccount = this.adAccountsList.filter((item) => item.providerId === target.adAccountId)[0];

    const campAdSets = this.campaignAdSets$.value;
    target.id = campAdSets.find((adSet) => adSet.providerId === target.providerId).id;

    this.modalService.create({
      nzTitle: `Edit targeting ${target.name}`,
      nzContent: CampaignTargetingEditComponent,
      nzComponentParams: {
        savedAudienceTemplate: target,
      },
      nzWidth: 1300,
    });
  }

  private getTargetings(campaign: CampaignDTO) {
    if (campaign?.providerId) {
      return this.service
        .findCampaignTargeting({
          campaignId: campaign.providerId,
          provider: SupportedProviders.FACEBOOK,
        })
        .pipe(
          map((response) => response),
          map((targetings) => {
            this.campaignTargeting = targetings.map((targeting) => ({
              ...targeting,
              targetSize: targeting.targetSize == -1 ? 0 : targeting.targetSize,
              active: false,
            }));
          }),
        );
    }
    return of(null);
  }
}
