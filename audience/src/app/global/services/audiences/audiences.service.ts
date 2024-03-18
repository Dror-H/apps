import { Injectable } from '@angular/core';
import { AudienceApiService } from '@audience-app/api/audience-api/audience-api.service';
import { TargetingApiService } from '@audience-app/api/targeting-api/targeting-api.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { notificationOnErrorOperator, notificationOnSuccessOperator } from '@audience-app/global/utils/operators';
import { AudiencesState } from '@audience-app/store/audiences.state';
import {
  AdAccountDTO,
  AdSetDTO,
  CampaignDTO,
  SearchResult,
  TargetingDto,
  UserTargetings,
} from '@instigo-app/data-transfer-object';
import { GetAudiencesParams } from '@instigo-app/ui/shared';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AudiencesService {
  @Emitter(AudiencesState.setFoundAudiences) setFoundAudiences: Emittable<SearchResult[]>;
  @Emitter(AudiencesState.addFoundAudiences) addFoundAudiences: Emittable<SearchResult[]>;
  @Emitter(AudiencesState.setSelectedAudiences) setSelectedAudiences: Emittable<SearchResult[]>;
  @Emitter(AudiencesState.toggleSelectAudience) toggleSelectAudience: Emittable<SearchResult>;
  @Emitter(AudiencesState.addSearchHistoryValue) addSearchHistoryValue: Emittable<string>;
  @Emitter(AudiencesState.setSearchHistory) setSearchHistory: Emittable<string[]>;
  @Emitter(AudiencesState.removeSearchHistoryValue) removeSearchHistoryValue: Emittable<string>;

  constructor(
    private audienceApiService: AudienceApiService,
    private targetingApiService: TargetingApiService,
    private displayNotificationService: DisplayNotificationService,
    private loadingService: LoadingService,
  ) {}

  public resetAudiences(): void {
    this.setFoundAudiences.emit([]);
  }

  public resetSelectedAudiences(): void {
    this.setSelectedAudiences.emit([]);
  }

  public resetFoundAudiences(): void {
    this.setFoundAudiences.emit(null);
  }

  public getAudiencesById(ids: string[]): Observable<SearchResult[]> {
    return this.getAudiences({ id: ids });
  }

  public getAudiencesByKeywords(params: Omit<GetAudiencesParams, 'id'>): Observable<SearchResult[]> {
    params.keywords = params.keywords.map((v) => v.toLowerCase());
    return this.getAudiences(params);
  }

  public saveAudience(options: {
    name: string;
    targeting: TargetingDto;
    userTags: string[];
  }): Observable<UserTargetings> {
    return this.targetingApiService.saveUserTargeting(options).pipe(
      notificationOnSuccessOperator(this.displayNotificationService, {
        content: 'Audience created successfully! 🙌',
      }),
      notificationOnErrorOperator(this.displayNotificationService),
    );
  }

  public exportAudience(options: {
    name: string;
    targeting: TargetingDto;
    userTags: string[];
    adAccount: AdAccountDTO;
  }): Observable<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }> {
    return this.targetingApiService.saveAndExportTargeting(options).pipe(
      notificationOnSuccessOperator(this.displayNotificationService, {
        content: 'Audience created successfully! 🙌',
      }),
      notificationOnErrorOperator(this.displayNotificationService),
    );
  }

  public setLoadingStateOnGetAudiences({ id, keywords }: GetAudiencesParams, loadingState = true): void {
    if (id) {
      this.loadingService.isLoadingMergedAudience.emit(loadingState);
    }

    if (keywords) {
      this.loadingService.isLoadingAudiences.emit(loadingState);
    }
  }

  private getAudiences(params: GetAudiencesParams): Observable<SearchResult[]> {
    this.setLoadingStateOnGetAudiences(params, true);

    return this.audienceApiService.getAudiences(params).pipe(
      notificationOnErrorOperator(this.displayNotificationService),
      tap({
        next: () => {
          this.setLoadingStateOnGetAudiences(params, false);
        },
        error: () => {
          this.setLoadingStateOnGetAudiences(params, false);
        },
      }),
    );
  }
}
