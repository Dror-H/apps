import { Workspace } from '@api/workspace/data/workspace.entity';
import { MissingOAuthTokenException } from '@instigo-app/api-shared';
import {
  ProviderParameters,
  Resources,
  SupportedProviders,
  TimeIncrement,
  TimeRange,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyInsightsApiService } from '@instigo-app/third-party-connector';
import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import { CondOperator } from '@nestjsx/crud-request';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { differenceInCalendarDays, sub } from 'date-fns';
import { groupBy, isEmpty } from 'lodash';
import { EMPTY, forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, reduce, switchMap } from 'rxjs/operators';
import { getRepository } from 'typeorm';

export class ResourceInsightsService {
  protected readonly logger = new Logger('ResourceInsightsService');

  @Inject(ThirdPartyInsightsApiService)
  private readonly thirdPartyInsightsApiService: ThirdPartyInsightsApiService;

  setCrudRequestOptions({ request, workspaceId }) {
    request.options.query = {
      alwaysPaginate: true,
      maxLimit: 50,
      join: {
        adAccount: {
          eager: true,
          allow: ['id', 'name', 'currency', 'minDailyBudget', 'provider', 'providerId', 'timezoneName'],
        },
        workspace: {
          eager: true,
          alias: 'adAccountWorkspace',
          allow: ['id', 'name'],
        },
        'adAccount.workspace': {
          eager: true,
          alias: 'adAccountWorkspace',
          allow: ['id', 'name'],
        },
        campaign: {
          eager: true,
          alias: 'campaign',
          allow: ['id', 'name'],
        },
        adSet: {
          eager: true,
          alias: 'adSet',
          allow: ['id', 'name', 'bidStrategy'],
        },
      },
    };
    request.parsed.filter.push({
      field: 'adAccountWorkspace.id',
      operator: CondOperator.EQUALS,
      value: workspaceId,
    });
    request.parsed.search.$and.push({
      ['adAccountWorkspace.id']: {
        [CondOperator.EQUALS]: workspaceId,
      },
    });
    return request;
  }

  sanitizeTimeIncrement(timeRange) {
    const diff = Math.abs(differenceInCalendarDays(new Date(timeRange.start), new Date(timeRange.end)));
    if (diff <= 90) return TimeIncrement.DAILY;
    if (diff > 90 && diff < 365) return TimeIncrement.MONTHLY;
    if (diff >= 365) return TimeIncrement.YEARLY;
  }

  insights(options: {
    type: Resources;
    timeIncrement: TimeIncrement | number;
    timeRange: TimeRange;
    providerParameters: Partial<ProviderParameters>;
    crudRequest: CrudRequest;
    workspace: WorkspaceDTO;
  }): Observable<any> {
    const { type, timeRange, providerParameters, workspace } = options;
    let { timeIncrement = TimeIncrement.ALL } = options;
    if (!timeRange?.start || !timeRange?.end) {
      throw new HttpException(`TimeRange undefined`, HttpStatus.BAD_REQUEST);
    }
    if (timeIncrement !== TimeIncrement.ALL) {
      timeIncrement = this.sanitizeTimeIncrement(timeRange);
      this.logger.warn(`Time increment sanitized to ${timeIncrement}`);
    }
    const crudRequest = this.setCrudRequestOptions({ request: options.crudRequest, workspaceId: workspace.id });
    const crudService = new TypeOrmCrudService<any>(getRepository(type));
    return from(crudService.getMany(crudRequest)).pipe(
      switchMap((result: GetManyDefaultResponse<any>) => {
        const resources = result.data;
        if (isEmpty(resources)) {
          return of(resources);
        }
        return from(Object.entries(groupBy(resources, 'provider'))).pipe(
          mergeMap(([provider, entries]) =>
            this.fetchInsights({ workspace, entries, provider, type, timeRange, timeIncrement, providerParameters }),
          ),
          reduce((acc, val) => acc.concat(val)),
          map((data) => {
            result.data = data;
            return result;
          }),
        );
      }),
      catchError(() => of({ data: [], count: 0, total: 0, page: 0, pageCount: 0 })),
    );
  }

  fetchInsights(options: {
    workspace: Partial<Workspace | WorkspaceDTO>;
    entries: any[];
    provider: SupportedProviders | string;
    type: Resources;
    timeRange: TimeRange;
    timeIncrement: TimeIncrement | number;
    providerParameters: Partial<ProviderParameters>;
  }): Observable<any> {
    const { workspace, entries, provider, type, timeRange, timeIncrement, providerParameters } = options;
    const { accessToken } = workspace.owner.getAccessToken({ provider });
    if (!accessToken) {
      return throwError(new MissingOAuthTokenException({ provider }));
    }
    const payload = {
      accessToken,
      id: entries.map((providerResource) => providerResource.providerId),
      provider: provider as SupportedProviders,
      type,
      timeRange,
      timeIncrement,
      params: providerParameters,
      paginate: true,
    };
    if (providerParameters?.versus) {
      const versusTimeRange: TimeRange = {
        start: sub(new Date(timeRange.start), {
          days: Math.abs(differenceInCalendarDays(new Date(timeRange.start), new Date(timeRange.end))),
        }),
        end: timeRange.start,
      };
      return forkJoin([
        this.thirdPartyInsightsApiService.insights(payload),
        this.thirdPartyInsightsApiService.insights({
          ...payload,
          timeRange: versusTimeRange,
          timeIncrement: TimeIncrement.ALL,
        }),
      ]).pipe(
        catchError(() => EMPTY),
        map((response) => {
          const [current, versus] = response;
          return entries.map((entry) => {
            const insights = current[entry.providerId] || {};
            const versusInsights = versus[entry.providerId]?.summary || {};
            return {
              ...entry,
              [Resources.INSIGHTS]: { ...insights, versusSummary: versusInsights },
            };
          });
        }),
      );
    }
    return this.thirdPartyInsightsApiService.insights(payload).pipe(
      catchError(() => EMPTY),
      map((insightsList) =>
        entries.map((entry) => {
          const insights = insightsList[entry.providerId] || {};
          return {
            ...entry,
            [Resources.INSIGHTS]: insights,
          };
        }),
      ),
    );
  }
}
