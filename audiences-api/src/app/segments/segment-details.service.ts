import { CATEGORY_ID_PREFIX } from '@audiences-api/shared/constants';
import { AssertUtils } from '@instigo-app/api-shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FacebookSegment, FacebookTarget } from '@prisma/client';
import { cloneDeep, uniqBy } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { MissingSegmentDetailsEvent, MISSING_SEGMENT_DETAILS } from '../segments/segments.service';
import { FlexibleSpec, SearchResult, Segment } from '../shared/model';
import { ratioToPercents } from './ratio-to-percents.utils';

@Injectable()
export class SegmentDetailsService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private readonly logger = new Logger(SegmentDetailsService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async appendDetailsOnSegments(options: { specs: SearchResult[] }): Promise<SearchResult[]> {
    const { specs } = options;
    const segmentDetails = await this.prismaService.$queryRaw<FacebookSegment[]>`SELECT
    id,
    "name",
    description,
    disambiguation_category AS "disambiguationCategory",
    category,
    topic,
    "path",
    audience_size_lower_bound AS "audienceSizeLowerBound",
    audience_size_upper_bound AS "audienceSizeUpperBound",
    status
  FROM
    facebook_segments
  WHERE
    status = 'NORMAL'
    AND audience_size_upper_bound != 0
    AND audience_size_lower_bound != 0
    AND name IS NOT NULL
    AND path IS NOT NULL
    AND category NOT in('college_years')`;
    for (const spec of specs) {
      if (Array.isArray(spec.spec.targeting.flexible_spec)) {
        for (const flexibleSpec of spec.spec.targeting.flexible_spec) {
          this.appendSpecDetails(flexibleSpec, segmentDetails);
        }
        for (const flexibleSpec of spec.spec.targeting.flexible_spec) {
          this.removeSegmentsDoubles(flexibleSpec);
        }
      }
      if (spec.spec.targeting.exclusions) {
        this.appendSpecDetails(spec.spec.targeting.exclusions, segmentDetails);
        this.removeSegmentsDoubles(spec.spec.targeting.exclusions);
      }
    }
    return specs;
  }

  public appendSegmentRatios(audiences: SearchResult[]): void {
    for (const audience of audiences) {
      const segmentRatio = {};
      for (const flexibleSpec of audience.spec.targeting.flexible_spec) {
        this.getSegmentRatio(flexibleSpec, segmentRatio);
      }
      audience.specRatio = ratioToPercents(segmentRatio);
    }
  }

  private removeSegmentsDoubles(flexSpec: FlexibleSpec): void {
    for (const key of Object.keys(flexSpec)) {
      const segments = flexSpec[key];
      for (let i = 0; i < segments.length; i++) {
        this.removeSegmentsDoublesByNameAndPath(flexSpec, segments[i]);
      }
    }
  }

  private removeSegmentsDoublesByNameAndPath(flexibleSpec: FlexibleSpec, segment: Segment): void {
    for (const specKey of Object.keys(flexibleSpec)) {
      flexibleSpec[specKey] = flexibleSpec[specKey].filter(
        (s: Segment) => s.id === segment.id || s.name !== segment.name || s.path.join('') !== segment.path.join(''),
      );
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private appendSpecDetails(flexibleSpec: FlexibleSpec, allSegmentsDetails: FacebookSegment[]): void {
    for (const key in flexibleSpec) {
      const specArr = flexibleSpec[key] as (Segment | string | number | null)[];
      const specWithDetails = [] as Segment[];
      for (let i = 0; i < specArr.length; i++) {
        const segment: Segment | string | number | null = cloneDeep(specArr[i]);
        if (segment) {
          const segmentDetails = allSegmentsDetails.find((item: FacebookSegment) =>
            this.segmentDetailsFindFn(item, segment),
          );
          if (segmentDetails?.status === 'NORMAL') {
            specWithDetails.push(this.getProcessedDetails(segmentDetails));
          } else if (!segmentDetails) {
            this.eventEmitter.emit(
              MISSING_SEGMENT_DETAILS,
              new MissingSegmentDetailsEvent({
                id: AssertUtils.isStringOrNumber(segment) ? String(segment) : segment.id,
                name: AssertUtils.isStringOrNumber(segment) ? '' : segmentDetails?.name,
              }),
            );
          }
        }
      }
      flexibleSpec[key] = specWithDetails;
    }
  }

  private segmentDetailsFindFn(item: FacebookSegment, segment: Segment | string | number | null): boolean {
    if (AssertUtils.isStringOrNumber(segment)) {
      if (!Object.keys(CATEGORY_ID_PREFIX).includes(item.category)) {
        return false;
      }
      return item.id === `${CATEGORY_ID_PREFIX[item.category]}${segment}`;
    }
    return item.id === segment?.id;
  }

  private getProcessedDetails(foundItem: FacebookSegment): Segment {
    const segmentWithDetails = {} as Segment;
    segmentWithDetails.id = foundItem.id;
    segmentWithDetails.name = foundItem.name;
    segmentWithDetails.path = foundItem.path as string[];
    segmentWithDetails.size = (Number(foundItem.audienceSizeLowerBound) + Number(foundItem.audienceSizeUpperBound)) / 2;
    segmentWithDetails.type = foundItem.category.toLowerCase();
    segmentWithDetails.topic = foundItem.topic;
    return segmentWithDetails;
  }

  private getSegmentRatio(
    flexibleSpec: FlexibleSpec,
    previousSegmentRatio?: { [k: string]: number },
  ): { [k: string]: number } {
    const segmentRatio: { [k: string]: number } = previousSegmentRatio ? previousSegmentRatio : {};
    for (const key of Object.keys(flexibleSpec)) {
      for (let i = 0; i < flexibleSpec[key].length; i++) {
        segmentRatio[key] = Number(segmentRatio[key] || 0) + 1;
      }
    }
    return segmentRatio;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  getSegmentsWithIdAndName({ specs }: { specs: FacebookTarget[] }): Pick<Segment, 'id' | 'type' | 'name'>[] {
    const segments = [];
    const collect = (flexibleSpecItem: FlexibleSpec[]): void => {
      for (const key of Object.keys(flexibleSpecItem)) {
        for (const segment of flexibleSpecItem[key]) {
          if (segment && segment?.id !== undefined) {
            segments.push({ id: segment?.id, type: key, name: segment.name });
          }
        }
      }
    };
    for (const spec of specs) {
      if (spec.spec['targeting']?.flexible_spec && Array.isArray(spec.spec['targeting'].flexible_spec)) {
        for (const flexibleSpec of spec.spec['targeting']?.flexible_spec) {
          collect(flexibleSpec);
        }
      }
      if (spec.spec['targeting']?.exclusions) {
        collect(spec.spec['targeting']?.exclusions);
      }
    }
    return uniqBy(segments, 'id');
  }
}
