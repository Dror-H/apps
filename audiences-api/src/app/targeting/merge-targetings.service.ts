import { AssertUtils } from '@instigo-app/api-shared';
import { Injectable, Logger } from '@nestjs/common';
import { maxBy, uniq, uniqBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  FlexibleSpec,
  GeoLocations,
  GeoLocationsObjectKeys,
  GeoLocationsStringKeys,
  SearchResult,
} from '../shared/model';
import { Segment } from './../shared/model';

interface MergedAudienceProcessedData {
  includes: FlexibleSpec[];
  exclusion: FlexibleSpec[];
  geoLocations: GeoLocations;
  id: string;
  name: string;
}

@Injectable()
export class MergeTargetingsService {
  private readonly logger = new Logger(MergeTargetingsService.name);

  public merge(options: { audiences: SearchResult[] }): SearchResult {
    const { audiences } = options;
    const mergedData = this.getMergedAudienceProcessedData(audiences);
    const { includes, exclusion } = mergedData;
    this.deduplicateIncludesAndExclusion(includes, exclusion[0]);
    return this.getMergedAudience(mergedData, audiences);
  }

  getMergedAudienceProcessedData(audiences: SearchResult[]): MergedAudienceProcessedData {
    return {
      includes: this.getMergedIncludesFromAudiences(audiences),
      exclusion: this.getMergedExcludesFromAudiences(audiences),
      geoLocations: this.getMergedGeoLocations(audiences),
      id: audiences.length === 1 ? audiences[0].id : (uuidv4() as string),
      name: audiences.length === 1 ? audiences[0].spec.name : `MERGE`,
    };
  }

  getMergedAudience(mergedData: MergedAudienceProcessedData, audiences: SearchResult[]): SearchResult {
    const { id, name, includes, exclusion, geoLocations } = mergedData;
    return {
      id,
      spec: {
        id,
        name,
        targeting: {
          flexible_spec: includes,
          exclusions: exclusion[0],
          geo_locations: geoLocations,
          locales: Array.from(new Set(audiences.map((audience) => audience.spec.targeting.locales).flat())),
        },
      },
      userTags: Array.from(new Set(audiences.map((audience) => audience.userTags).flat()))
        .filter(Boolean)
        .slice(0, 30),
      topics: Array.from(new Set(audiences.map((audience) => audience.topics).flat())).slice(0, 30),
      createdByContributors: audiences.map((audience) => audience.createdByContributors).some((x) => x),
      rank: 0,
    };
  }

  getMergedIncludesFromAudiences(audiences: SearchResult[]): FlexibleSpec[] {
    return this.mergeFlexibleSpec(audiences.map((audience) => audience.spec.targeting.flexible_spec));
  }

  getMergedExcludesFromAudiences(audiences: SearchResult[]): FlexibleSpec[] {
    return this.mergeFlexibleSpec(audiences.map((audience) => [audience.spec.targeting.exclusions]));
  }

  getMergedGeoLocations(audiences: SearchResult[]): GeoLocations {
    return this.mergeGeoLocations(audiences.map((audience) => audience.spec.targeting.geo_locations));
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  deduplicateIncludesAndExclusion(includes: FlexibleSpec[], exclusion: FlexibleSpec): void {
    this.removeNullValuesFromExclusion(exclusion);
    for (let i = 0; i < includes.length; i++) {
      const include = includes[i];
      for (const key in include) {
        for (const segment of include[key]) {
          if (segment?.id) {
            this.removeIncludesSegmentIfInExclusion(exclusion, segment, key);
            this.deduplicateIncludes(includes, segment);
          }
        }
        include[key] = include[key].filter((segment: any) => !!segment.id || typeof segment !== 'number');
      }
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  deduplicateIncludes(flexSpecs: FlexibleSpec[], segment: Segment | string | number): void {
    const foundSegment = { segment: null, key: '' };
    for (const flexSpec of flexSpecs) {
      for (const specKey of Object.keys(flexSpec)) {
        const idOnlyKeys = ['education_statuses', 'relationship_statuses'];
        if (!idOnlyKeys.includes(specKey)) {
          flexSpec[specKey] = uniqBy(flexSpec[specKey], 'id');
        } else {
          flexSpec[specKey] = uniq(flexSpec[specKey]);
        }
        const segments = flexSpec[specKey];
        for (const currentSegment of segments) {
          if (currentSegment === null) {
            flexSpec[specKey] = flexSpec[specKey].filter((s) => s !== null);
          } else if (AssertUtils.isStringOrNumber(currentSegment) && !foundSegment.segment) {
            foundSegment.segment = currentSegment;
          } else if (AssertUtils.isStringOrNumber(currentSegment) && foundSegment.segment) {
            flexSpec[specKey] = flexSpec[specKey].filter((s) => s !== currentSegment);
          } else if ((segment as Segment).id === currentSegment.id && foundSegment.segment) {
            flexSpec[specKey] = flexSpec[specKey].filter((s: Segment) => s.id !== (segment as Segment).id);
          } else if ((segment as Segment).id === currentSegment.id && !foundSegment.segment) {
            foundSegment.segment = currentSegment;
            foundSegment.key = specKey;
          }
        }
      }
    }
  }

  removeNullValuesFromExclusion(exclusion: FlexibleSpec): void {
    for (const key in exclusion) {
      exclusion[key] = exclusion[key].filter((e) => e !== null);
    }
  }

  removeIncludesSegmentIfInExclusion(exclusion: FlexibleSpec, segment: Segment, key: string): void {
    if (exclusion[key]?.find((exclusionSegment) => exclusionSegment.id === segment.id)) {
      exclusion[key] = exclusion[key].filter((s) => s.id !== segment.id);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  mergeFlexibleSpec(flexibleSpecs: FlexibleSpec[][]): FlexibleSpec[] {
    const maxNarrowSpec = this.maxNarrowSpec(flexibleSpecs);
    const flexibleSpec = [] as FlexibleSpec[];
    for (let narrow = 0; narrow < maxNarrowSpec; narrow++) {
      const collect = {};
      for (let i = 0; i < flexibleSpecs.length; i++) {
        const narrowing = flexibleSpecs[i][narrow];
        if (narrowing) {
          for (const key in narrowing) {
            collect[key] = collect[key] || [];
            if (narrowing[key] && Array.isArray(narrowing[key])) {
              collect[key].push(...narrowing[key]);
              collect[key] = Array.from(new Set(collect[key]));
              if (narrowing[key][0]?.id) {
                collect[key] = uniqBy(collect[key], 'id');
              }
            }
          }
        }
      }
      flexibleSpec.push(collect);
    }
    return flexibleSpec;
  }

  maxNarrowSpec(flexibleSpecs: FlexibleSpec[][]): number {
    return maxBy(flexibleSpecs, (arr) => arr.length).length;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  mergeGeoLocations(locations: GeoLocations[]): GeoLocations {
    const mergedGeoLocations = {} as any;
    for (const geoSpec of locations) {
      if (!geoSpec) {
        continue;
      }

      for (const [key, value] of Object.entries(geoSpec)) {
        if (GeoLocationsObjectKeys.includes(key)) {
          mergedGeoLocations[key] = uniqBy([...(mergedGeoLocations[key] || []), ...value], 'key');
        }
        if (GeoLocationsStringKeys.includes(key)) {
          mergedGeoLocations[key] = Array.from(new Set([...(mergedGeoLocations[key] || []), ...value]));
        }
        if (!GeoLocationsObjectKeys.includes(key) && !GeoLocationsStringKeys.includes(key)) {
          this.logger.error(`Unknown GeoLocation key: ${key}, object=> ${JSON.stringify(geoSpec)}`);
        }
      }
    }
    return mergedGeoLocations as GeoLocations;
  }
}
