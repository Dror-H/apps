import { pMap } from '@instigo-app/api-shared';
import { FacebookTargetingOptionStatus } from '@instigo-app/data-transfer-object';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import to from 'await-to-js';
import { AxiosResponse } from 'axios';
import { chunk } from 'lodash';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Merge } from 'type-fest';
import { AdAccountRepository } from '../ad-account/ad-account.repository';
import { AuditLog, LOG_AUDIT } from '../audit_logs/audit_logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { Segment } from '../shared/model';

export const MISSING_SEGMENT_DETAILS = 'missing-segment-details';
export class MissingSegmentDetailsEvent {
  id: string;
  name: string;
  constructor(options: { id: string; name: string }) {
    this.id = options.id;
    this.name = options.name;
  }
}

@Injectable()
export class SegmentsService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  private readonly logger = new Logger(SegmentsService.name);

  private account: any;

  constructor(private readonly adAccountRepository: AdAccountRepository, private eventEmitter: EventEmitter2) {
    void this.adAccountRepository.getAnyAdAccount().then(([adAccount]: any) => {
      this.logger.log(`Using in the segment service=>${adAccount?.id}`);
      this.account = adAccount;
    });
  }

  @OnEvent(MISSING_SEGMENT_DETAILS, { async: true })
  async missingSegmentDetails(event: MissingSegmentDetailsEvent): Promise<void> {
    this.eventEmitter.emit(LOG_AUDIT, new AuditLog({ context: 'missing_segment_details', payload: event }));
    let details: Segment[] = null;
    details = await this.getSegmentDetails({ segment: { id: event.id } });
    if (!details) {
      details = await this.searchSegmentDetails({ segment: event, account: this.account });
    }
    if (details) {
      await to(
        this.prismaService.facebookSegment.createMany({
          data: [...details]
            .filter((detail) => detail.id)
            .map((detail) => ({
              id: detail.id,
              name: detail.name,
              audienceSizeLowerBound: detail?.audience_size_lower_bound || 0,
              audienceSizeUpperBound: detail?.audience_size_upper_bound || 0,
              path: detail?.path,
              description: detail?.description,
              category: detail?.type?.toLowerCase() || detail?.path[0]?.toLowerCase() || 'unknown',
              disambiguationCategory: detail?.disambiguation_category,
              topic: detail?.topic,
            })),
          skipDuplicates: true,
        }),
      );
    }
  }

  public async getSegmentDetails(options: { segment: Pick<Segment, 'id'> }): Promise<Segment[]> {
    const { segment } = options;
    const url = `https://graph.facebook.com/v14.0/${segment.id}?access_token=${this.account.access_token}`;
    return await this.httpService
      .get(url)
      .pipe(
        map((res: AxiosResponse<Segment>) => [res.data]),
        catchError(() => []),
      )
      .toPromise();
  }

  public async searchSegmentDetails(options: {
    segment: { name: string };
    account?: { id: string; access_token: string };
  }): Promise<Segment[]> {
    const { segment } = options;
    const account = options.account || this.account;
    const url = `https://graph.facebook.com/v14.0/${account.id}/targetingsearch?q=${segment.name}&access_token=${account.access_token}`;
    return await this.httpService
      .get(url)
      .pipe(
        map((res: AxiosResponse<{ data: Segment[] }>) => res.data.data),
        catchError(() => EMPTY),
      )
      .toPromise();
  }

  async getSegmentsTargetingValidation(options: {
    segments: Pick<Segment, 'id' | 'type' | 'name'>[];
    account?: { id: string; access_token: string };
  }): Promise<Segment[]> {
    const { segments } = options;
    const account = options.account || this.account;
    const validatedSegments = await pMap<Merge<Segment, { valid: boolean }>[]>(
      chunk(segments, 100),
      async (splittedSegment: Segment[]) => {
        const stringifiedSegment = JSON.stringify(splittedSegment.map(({ id, type }) => ({ id, type })));
        const url = `https://graph.facebook.com/v14.0/${account.id}/targetingvalidation?targeting_list=${stringifiedSegment}&access_token=${account.access_token}`;
        return await this.httpService
          .get(url)
          .pipe(
            map((res: AxiosResponse<{ data: Merge<Segment, { valid: boolean }>[] }>) => res?.data?.data),
            catchError((err) => []),
          )
          .toPromise();
      },
    );
    return validatedSegments?.filter((item) => item && item?.valid) || [];
  }

  async getSegmentsTargetingStatus(options: {
    segments: Pick<Segment, 'id'>[];
    account?: { id: string; access_token: string };
  }): Promise<FacebookTargetingOptionStatus[]> {
    const segmentIds = options.segments.map(({ id }) => id);
    const account = options.account || this.account;
    return await pMap<FacebookTargetingOptionStatus[]>(chunk(segmentIds, 100), async (splittedSegment: Segment[]) => {
      const stringifiedSegment = JSON.stringify(splittedSegment);
      const url = `https://graph.facebook.com/v14.0/search?targeting_option_list=${stringifiedSegment}&type=targetingoptionstatus&access_token=${account.access_token}`;
      return await this.httpService
        .get(url)
        .pipe(
          map((res: AxiosResponse<{ data: FacebookTargetingOptionStatus[] }>) => res?.data?.data),
          catchError((err) => []),
        )
        .toPromise();
    });
  }

  public async targetingBrowse(options?: { account?: { id: string; access_token: string } }): Promise<Segment[]> {
    const account = options?.account || this.account;
    const { id, access_token } = account;
    const browse: Merge<Segment, { raw_name: string }>[] = await this.httpService
      .get(`https://graph.facebook.com/v14.0/${id}/targetingbrowse?access_token=${access_token}`)
      .pipe(
        map((res: AxiosResponse<{ data: Merge<Segment, { raw_name: string }>[] }>) => res.data.data),
        catchError(() => EMPTY),
      )
      .toPromise();

    return browse?.map((item) => ({ ...item, name: item?.raw_name || item?.name })) || [];
  }

  public async targetingOptions(options?: { account?: { id: string; access_token: string } }): Promise<Segment[]> {
    const account = options?.account || this.account;
    const { access_token } = account;
    const classes = [
      'interests',
      'behaviors',
      'demographics',
      'life_events',
      'industries',
      'income',
      'family_statuses',
      'user_device',
      'user_os',
    ];
    return await classes.reduce(async (acc, className) => {
      const data: Merge<Segment, { raw_name: string }>[] = await this.httpService
        .get(
          `https://graph.facebook.com/v14.0/search?type=adTargetingCategory&class=${className}&access_token=${access_token}`,
        )
        .pipe(
          map((res: AxiosResponse<{ data: Merge<Segment, { raw_name: string }>[] }>) => res.data.data),
          catchError(() => EMPTY),
        )
        .toPromise();
      return [...(await acc), ...(data || [])];
    }, Promise.resolve([]));
  }
}
