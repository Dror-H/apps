import { Component, Input, OnInit } from '@angular/core';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import { ObservableLoadingInterface, ObservableType } from '@instigo-app/data-transfer-object';
import { format, formatDistance, parseJSON, startOfYesterday } from 'date-fns';
import { sortedUniq } from 'lodash-es';
import { Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  mergeMap,
  scan,
  toArray,
} from 'rxjs/operators';

@Component({
  selector: 'ingo-workspace-trackers',
  templateUrl: './workspace-trackers.component.html',
  styleUrls: ['workspace-trackers.component.scss'],
})
export class WorkspaceTrackersComponent implements OnInit {
  @Input()
  public adAccounts$: Observable<ObservableLoadingInterface<any[]>>;

  public pixels$: Observable<any[]>;

  constructor(public audienceApiService: AudienceApiService) {}

  ngOnInit(): void {
    this.pixels$ = this.adAccounts$.pipe(
      filter((data) => data.type === ObservableType.FINISH && data.value?.length > 0),
      distinctUntilChanged((prev: any, curr: any) => {
        const prevIds = prev.value.map((item) => item.id);
        const currIds = curr.value.map((item) => item.id);
        return JSON.stringify(sortedUniq(prevIds)) === JSON.stringify(sortedUniq(currIds));
      }),
      mergeMap((data) => data.value),
      filter((adAccount: any) => !!adAccount?.providerId),
      concatMap((account) => this.getPixels(account)),
      scan((acc: any, value: any) => [...acc, ...value], []),
    );
  }

  public getPixels({ name, providerId, provider }): any {
    return this.audienceApiService
      .findAllTrackers({
        adAccountProviderId: providerId,
        provider: provider,
      })
      .pipe(
        mergeAll(),
        map((item) => ({
          name: item.name || 'LinkedIn Insights Tag',
          provider: item.provider,
          lastChecked: this.formatTimes(item.lastChecked),
          isUnavailable: item.isUnavailable ? true : false,
          account: name,
        })),
        toArray(),
        catchError(() => of([])),
      );
  }

  private formatTimes(lastChecked: string | Date): any {
    const timeString = lastChecked || startOfYesterday();
    return {
      actualTime: format(parseJSON(timeString), "eee, MMM do y 'at' HH:mm"),
      relativeTime: formatDistance(parseJSON(timeString), new Date(), { addSuffix: true }),
    };
  }
}
