import { Component, Input, OnInit } from '@angular/core';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { AdDTO, CampaignStatusType, NotificationType } from '@instigo-app/data-transfer-object';
import { map, skip, take } from 'rxjs/operators';
import { adsTableConfig, AdsTableConfigInterface } from './ads-table.config';
import { AdApiService } from '@app/api/services/ad.api.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ingo-campaign-ads-table',
  templateUrl: './campaign-ads-table.component.html',
})
export class CampaignAdsTableComponent implements OnInit {
  @Input()
  campaignAds$: BehaviorSubject<any>;

  public accountCurrency: string;
  public allAds$: BehaviorSubject<AdDTO[]> = new BehaviorSubject(null);
  public adsTableConfig: AdsTableConfigInterface[] = adsTableConfig;

  constructor(private readonly adApiService: AdApiService, private readonly displayNotification: DisplayNotification) {}

  ngOnInit(): void {
    this.campaignAds$
      .pipe(
        skip(1),
        map((result) => result),
      )
      .subscribe((result) => {
        this.accountCurrency = result?.[0].adAccount.currency;
        this.allAds$.next(result ? result : []);
      });
  }

  changeStatus(item, type): void {
    const status = item.status === CampaignStatusType.ACTIVE ? CampaignStatusType.PAUSED : CampaignStatusType.ACTIVE;
    item['loading'] = true;
    const observable$ = (type) => this.adApiService.changeStatus({ ads: [item], status });
    observable$(type)
      .pipe(take(1))
      .subscribe(
        () => {
          item.status = status;
          item['loading'] = false;
        },
        (error) => {
          this.displayNotification.displayNotification(
            new Notification({
              content: `We failed to update the status`,
              type: NotificationType.ERROR,
            }),
          );
        },
      );
  }

  public previewLinkedinCreative(shareId: number, adId: string, companyId: string): string {
    // TODO
    // URL Syntax
    // `https://www.linkedin.com/feed/update/urn:li:sponsoredContentV2:(urn:li:share:${shareId},urn:li:sponsoredCreative:${adId})/?actorCompanyId=${companyId}&viewContext=REVIEWER`
    // Example
    // https://www.linkedin.com/feed/update/urn:li:sponsoredContentV2:(urn:li:share:6763114526792585216,urn:li:sponsoredCreative:123385644)/?actorCompanyId=562951&viewContext=REVIEWER
    return null;
  }
}
