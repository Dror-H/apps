import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdSetApiService } from '@app/api/services/ad-set.api.service';
import { AdApiService } from '@app/api/services/ad.api.service';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { AdDTO, AdSetDTO, CampaignDTO, CampaignStatusType } from '@instigo-app/data-transfer-object';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, of, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { CampaignsViewService } from './campaigns-view.service';

@Injectable()
export class QuickActionsService {
  constructor(
    private readonly campaignApiService: CampaignApiService,
    private readonly campaignsViewService: CampaignsViewService,
    private readonly adSetApiService: AdSetApiService,
    private readonly adApiService: AdApiService,
    private readonly modal: NzModalService,
    private readonly displayNotification: DisplayNotification,
  ) {}

  public updateCampaignFields(options: { campaigns: Partial<CampaignDTO>[] }): Observable<any> {
    const { campaigns } = options;
    return this.campaignApiService.bulkUpdate({ payload: campaigns }).pipe(take(1));
  }

  public updateAdSetFields(options: { adSets: Partial<AdSetDTO>[] }): Observable<any> {
    const { adSets } = options;
    return this.adSetApiService.bulkUpdate({ payload: adSets }).pipe(take(1));
  }

  public changeCampaignsStatus(options: { campaigns: Partial<CampaignDTO>[]; status: CampaignStatusType }) {
    const { campaigns, status } = options;
    const mapped = campaigns.map<Partial<CampaignDTO>>((campaign) => ({
      id: campaign.id,
      providerId: campaign.providerId,
      provider: campaign.provider,
      status,
    }));
    return this.campaignApiService.bulkUpdate({ payload: mapped }).pipe(
      tap(() => {
        this.campaignsViewService.updateCampaignsViewTableState({
          allRowsSelected: false,
          selectedItems: [],
        });
        this.campaignsViewService.refresh$.next(null);
      }),
      catchError((err: HttpErrorResponse) => {
        const e = err?.error?.error;
        this.displayNotification.displayNotification(
          new Notification({ title: e?.title, content: e?.description, type: NotificationType.ERROR }),
        );
        return of();
      }),
      take(1),
    );
  }

  public changeAdSetsStatus(options: { adsets: Partial<AdSetDTO>[]; status: CampaignStatusType }) {
    const { adsets, status } = options;
    return this.adSetApiService.changeStatus({ adsets, status }).pipe(
      tap(() => {
        this.campaignsViewService.updateAdSetsViewTableState({
          allRowsSelected: false,
          selectedItems: [],
        });
        this.campaignsViewService.refresh$.next(null);
      }),
      catchError((err: HttpErrorResponse) => {
        this.displayNotification.displayNotification(
          new Notification({ content: err.error.message, type: NotificationType.ERROR }),
        );
        return of();
      }),
      take(1),
    );
  }

  public changeAdStatus(options: { ads: Partial<AdDTO>[]; status: CampaignStatusType }) {
    const { ads, status } = options;
    return this.adApiService.changeStatus({ ads, status }).pipe(
      tap(() => {
        this.campaignsViewService.updateAdsViewTableState({
          allRowsSelected: false,
          selectedItems: [],
        });
        this.campaignsViewService.refresh$.next(null);
      }),
      catchError((err: HttpErrorResponse) => {
        this.displayNotification.displayNotification(
          new Notification({ content: err.error.message, type: NotificationType.ERROR }),
        );
        return of();
      }),
      take(1),
    );
  }

  public deleteCampaigns(campaigns: CampaignDTO[]) {
    this.modal.confirm({
      nzTitle: 'Are you sure?',
      nzContent: `You won't be able to revert this!`,
      nzOkText: 'Delete',
      nzOkType: 'danger',
      nzOnOk: () => {
        const campaignIds = campaigns.map(({ id }) => id);
        this.campaignApiService
          .deleteMany({ campaignIds })
          .pipe(
            tap((response) => {
              this.campaignsViewService.updateCampaignsViewTableState({
                allRowsSelected: false,
                selectedItems: [],
              });
              this.campaignsViewService.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  content: `Campaign has been successfully deleted`,
                  type: NotificationType.SUCCESS,
                }),
              );
            }),
            catchError((err: HttpErrorResponse) => {
              this.displayNotification.displayNotification(
                new Notification({ content: err.message, type: NotificationType.ERROR }),
              );
              return throwError(new Error(err.message));
            }),
            take(1),
          )
          .subscribe();
      },
    });
  }
}
