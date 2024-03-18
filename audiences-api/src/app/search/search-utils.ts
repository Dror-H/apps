import { flatten, uniqBy } from 'lodash';
import { FlexibleSpec, SearchResult, Segment } from '../shared/model';

export class SearchUtils {
  static removeEmptyObjectsAndArraysFromTargeting(audiences: SearchResult[]): void {
    for (const audience of audiences) {
      this.removeEmptyObjectsAndArraysFromFlexibleSpecs(audience);
      this.removeEmptyObjectsAndArraysFromExclusions(audience);
    }
  }

  static removeEmptyObjectsAndArraysFromFlexibleSpecs(audience: SearchResult): void {
    const flexSpecs = audience.spec.targeting.flexible_spec;
    for (const flexSpec of flexSpecs) {
      for (const key in flexSpec) {
        if (flexSpec[key].length === 0) {
          delete flexSpec[key];
        }
      }
    }
    audience.spec.targeting.flexible_spec = flexSpecs.filter((flexSpec) => Object.keys(flexSpec).length > 0);
  }

  static removeEmptyObjectsAndArraysFromExclusions(audience: SearchResult): void {
    let exclusions = audience.spec.targeting.exclusions;
    if (exclusions) {
      for (const key in exclusions) {
        if (exclusions[key].length === 0) {
          delete exclusions[key];
        }
      }
      if (Object.keys(exclusions).length === 0) {
        exclusions = undefined;
      }
    }
    audience.spec.targeting.exclusions = exclusions;
  }

  static removeInvalidTypeSegments(audiences: SearchResult[]): void {
    const invalidSpecKeys: (keyof FlexibleSpec)[] = ['college_years'];
    for (const audience of audiences) {
      this.removeInvalidTypesFlexSpec(audience, invalidSpecKeys);
      this.removeInvalidTypesExclusion(audience, invalidSpecKeys);
    }
  }

  static removeInvalidTypesFlexSpec(audience: SearchResult, invalidSpecKeys: (keyof FlexibleSpec)[]): void {
    const flexSpecs = audience.spec.targeting.flexible_spec;
    const validFlexSpecs = flexSpecs.map((flexSpec) => {
      for (const key in flexSpec) {
        if (invalidSpecKeys.includes(key as keyof FlexibleSpec)) {
          delete flexSpec[key];
        }
      }
      return flexSpec;
    });
    audience.spec.targeting.flexible_spec = validFlexSpecs;
  }

  static removeInvalidTypesExclusion(audience: SearchResult, invalidSpecKeys: (keyof FlexibleSpec)[]): void {
    const exclusions = audience.spec.targeting.exclusions;
    if (exclusions) {
      for (const key in exclusions) {
        if (invalidSpecKeys.includes(key as keyof FlexibleSpec)) {
          delete audience.spec.targeting.exclusions[key];
        }
      }
    }
  }

  static getAudiencesSegments(audiences: SearchResult[], returnExclusions = false): Segment[] {
    let segments: Segment[] = [];
    for (const audience of audiences) {
      segments = segments.concat(this.getAudienceFlexSpecSegments(audience.spec.targeting.flexible_spec));
      if (returnExclusions) {
        segments = segments.concat(this.getAudienceExclusionSegments(audience.spec.targeting.exclusions));
      }
    }
    return uniqBy(segments, 'id');
  }

  static getAudienceFlexSpecSegments(flexSpecs: FlexibleSpec[]): Segment[] {
    const segments: Segment[] = [];
    if (flexSpecs.length > 0) {
      for (const flexSpec of flexSpecs) {
        const flexSpecSegments = flatten(Object.values(flexSpec)) as Segment[];
        for (const segment of flexSpecSegments) {
          segments.push(segment);
        }
      }
    }
    return segments;
  }

  static getAudienceExclusionSegments(exclusions?: FlexibleSpec): Segment[] {
    const segments: Segment[] = [];
    if (exclusions && Object.keys(exclusions).length > 0) {
      const exclusionSegments = flatten(Object.values(exclusions)) as Segment[];
      for (const segment of exclusionSegments) {
        segments.push(segment);
      }
    }
    return segments;
  }

  static getValidSegmentsForValidationCall(segments: Segment[]): Segment[] {
    const invalidSegmentTypesForValidationCall = ['demographics'];
    return segments.filter((segment) => !invalidSegmentTypesForValidationCall.includes(segment.type));
  }

  static filterInvalidSegmentsFromFb(audiences: SearchResult[], validSegmentIds: string[]): void {
    const invalidSegmentTypesForValidationCall = ['demographics'];
    for (const audience of audiences) {
      this.removeInvalidFlexibleSpecFromFb(audience, validSegmentIds, invalidSegmentTypesForValidationCall);
      this.removeInvalidExclusionsFromFb(audience, validSegmentIds, invalidSegmentTypesForValidationCall);
    }
  }

  static removeInvalidFlexibleSpecFromFb(
    audience: SearchResult,
    validSegmentIds: string[],
    invalidSegmentTypesForValidationCall: string[],
  ): void {
    const flexSpec = audience.spec.targeting.flexible_spec;
    for (let i = 0; i < flexSpec.length; i++) {
      const spec = flexSpec[i];
      for (const key in spec) {
        if (!invalidSegmentTypesForValidationCall.includes(key)) {
          audience.spec.targeting.flexible_spec[i][key] = audience.spec.targeting.flexible_spec[i][key].filter((f) =>
            validSegmentIds.includes(f.id),
          );
        }
      }
    }
  }

  static removeInvalidExclusionsFromFb(
    audience: SearchResult,
    validSegmentIds: string[],
    invalidSegmentTypesForValidationCall: string[],
  ): void {
    const exclusions = audience.spec.targeting.exclusions;
    for (const key in exclusions) {
      if (!invalidSegmentTypesForValidationCall.includes(key)) {
        audience.spec.targeting.exclusions[key] = audience.spec.targeting.exclusions[key].filter((f) =>
          validSegmentIds.includes(f.id),
        );
      }
    }
  }
}
