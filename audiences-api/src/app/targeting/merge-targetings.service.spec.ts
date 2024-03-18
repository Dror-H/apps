import { Test } from '@nestjs/testing';
import { GeoLocations } from '../shared/model';
import {
  flexSpecsNullSegments,
  mockDeduplicateAll,
  mockDeduplicateIncludes,
  mockIncludesSegmentIfInExclusion,
  targetingNullSegments,
} from '../targeting/targeting-test-data/merge-duplicates-test-data';
import { MergeTargetingsService } from './merge-targetings.service';
import { AudiencesToMerge, mockMergedSingleAudience } from './targeting-test-data/merge-test-data';
const geoLocations = [
  '{"countries": ["US"], "location_types": ["home", "recent"]}',
  '{"regions": [{"key": "4079", "name": "England", "country": "GB"}, {"key": "4081", "name": "Scotland", "country": "GB"}], "countries": ["US", "IE", "CA", "AU"], "location_types": ["home", "recent"]}',
  '{"zips": [{"key": "US:79938", "name": "79938", "country": "US", "region_id": 3886, "primary_city_id": 2525963}], "location_types": ["home", "recent"], "custom_locations": [{"name": "11140 Montana Ave, El Paso, Texas, United States", "radius": 10, "country": "US", "latitude": 31.80031, "longitude": -106.31022, "region_id": 3886, "distance_unit": "mile", "address_string": "11140 Montana Ave, El Paso, Texas, United States", "primary_city_id": 2526788}]}',
  `{"cities": [{"key": "171230", "name": "Antwerp", "radius": 10, "region": "Flemish Region", "country": "BE", "region_id": "4136", "distance_unit": "mile"}, {"key": "2367397", "name": "Dnipro", "radius": 10, "region": "Dnipropetrovsk Oblast", "country": "UA", "region_id": "3781", "distance_unit": "mile"}, {"key": "2384095", "name": "Odessa", "radius": 10, "region": "Odessa Oblast", "country": "UA", "region_id": "3794", "distance_unit": "mile"}, {"key": "313044", "name": "Z\\u00fcrich", "radius": 10, "region": "Z\\u00fcrich", "country": "CH", "region_id": "603", "distance_unit": "mile"}, {"key": "542609", "name": "Berlin", "region": "Berlin", "country": "DE", "region_id": "840", "distance_unit": "mile"}, {"key": "550095", "name": "D\\u00fcsseldorf", "radius": 10, "region": "Nordrhein-Westfalen", "country": "DE", "region_id": "831", "distance_unit": "mile"}, {"key": "554021", "name": "Frankfurt", "radius": 10, "region": "Hessen", "country": "DE", "region_id": "829", "distance_unit": "mile"}, {"key": "579270", "name": "Munich", "radius": 10, "region": "Bayern", "country": "DE", "region_id": "826", "distance_unit": "mile"}, {"key": "771540", "name": "Marseille", "radius": 10, "region": "Provence-Alpes-C\\u00f4te d'Azur", "country": "FR", "region_id": "1087", "distance_unit": "mile"}, {"key": "777934", "name": "Paris", "radius": 10, "region": "\\u00cele-de-France", "country": "FR", "region_id": "1078", "distance_unit": "mile"}, {"key": "812057", "name": "London", "radius": 10, "region": "England", "country": "GB", "region_id": "4079", "distance_unit": "mile"}], "regions": [{"key": "1625", "name": "Budapest", "country": "HU"}, {"key": "3146", "name": "Moscow", "country": "RU"}], "location_types": ["home"], "custom_locations": [{"radius": 5, "country": "US", "latitude": 40.676993, "longitude": -73.901595, "region_id": 3875, "distance_unit": "mile", "primary_city_id": 2490299}]}`,
  '{"cities": [{"key": "2420379", "name": "Los Angeles", "region": "California", "country": "US", "region_id": "3847", "distance_unit": "mile"}, {"key": "2421836", "name": "San Francisco", "region": "California", "country": "US", "region_id": "3847", "distance_unit": "mile"}, {"key": "2490299", "name": "New York", "region": "New York", "country": "US", "region_id": "3875", "distance_unit": "mile"}], "places": [{"key": "155403677865323", "name": "BAY AREA", "radius": 2, "country": "US", "latitude": 38.123625, "longitude": -122.217148, "region_id": 3847, "distance_unit": "kilometer", "primary_city_id": 2422640}], "regions": [{"key": "3849", "name": "Connecticut", "country": "US"}], "location_types": ["home", "recent"], "medium_geo_areas": [{"key": "2790231", "name": "Orange County", "region": "California", "country": "US", "region_id": "3847"}]}',
  '{"countries": ["US", "IE", "IT", "NL", "NZ", "NO", "CA", "ES", "CH", "GB", "DK", "BE", "AU", "AT", "PT", "IS", "FR", "DE"], "location_types": ["home", "recent"]}',
  '{"cities": [{"key": "803904", "name": "Birmingham", "radius": 50, "region": "England", "country": "GB", "region_id": "4079", "distance_unit": "mile"}], "location_types": ["home"]}',
  '{"countries": ["US", "CA"], "location_types": ["home", "recent"]}',
  '{"countries": ["US"], "location_types": ["home"]}',
  '{"countries": ["US", "IE", "IT", "MC", "NL", "CA", "ES", "CH", "GB", "BE", "AT", "PT", "LU", "FR", "DE"], "location_types": ["home"]}',
  '{"regions": [{"key": "3849", "name": "Connecticut", "country": "US"}, {"key": "3862", "name": "Maine", "country": "US"}, {"key": "3864", "name": "Massachusetts", "country": "US"}, {"key": "3872", "name": "New Hampshire", "country": "US"}, {"key": "3875", "name": "New York", "country": "US"}, {"key": "3882", "name": "Rhode Island", "country": "US"}, {"key": "3888", "name": "Vermont", "country": "US"}], "location_types": ["home", "recent"]}',
  '{"countries": ["US", "IE", "IT", "NL", "NZ", "NO", "CA", "ES", "CH", "GB", "DK", "BE", "AU", "AT", "PT", "IS", "FR", "DE"], "location_types": ["home", "recent"]}',
  '{"countries": ["CH"], "location_types": ["home", "recent"]}',
  '{"countries": ["GB"], "location_types": ["home", "recent"]}',
  'null',
];

const flexibleSpecs = [
  [{ interests: [] }],
  [
    {
      interests: [{ id: '6002926675372', name: 'Scholarship' }],
      education_schools: [{ id: '475750562498596', name: 'Study in UK' }],
    },
  ],
  [
    {
      interests: [
        { id: '6002964301046', name: 'Business school' },
        { id: '6002926675372', name: 'Scholarship' },
      ],
      college_years: [2022, 2023, 2024, 2025, 2026],
      education_majors: [{ id: '106335129403847', name: 'Business management' }],
      education_statuses: [4, 5],
    },
    {
      interests: [{ id: '6003748928462', name: 'Destroyer' }],
    },
  ],
  [
    {
      interests: [
        { id: '6002926675372', name: 'Scholarship' },
        { id: '6003057317756', name: 'Business education' },
      ],
      education_statuses: [2, 100],
    },
    {
      interests: [{ id: '6004000198906', name: 'Professional development' }],
    },
  ],
] as any;

describe('MergeTargetings Test suite', () => {
  let service: MergeTargetingsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MergeTargetingsService],
    }).compile();

    service = module.get<MergeTargetingsService>(MergeTargetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get max narrow', () => {
    const max = service.maxNarrowSpec(flexibleSpecs);
    expect(max).toEqual(2);
  });

  it('should merge specs', () => {
    const merged = service.mergeFlexibleSpec(flexibleSpecs);
    expect(merged).toMatchSnapshot();
  });

  it('should merge locations', () => {
    const locations = service.mergeGeoLocations(geoLocations.map((v) => JSON.parse(v)) as GeoLocations[]);
    expect(locations).toMatchSnapshot();
  });

  describe('merge', () => {
    it('should return same search result as provided', () => {
      const mergedAudience = service.merge({ audiences: [mockMergedSingleAudience] });
      expect(mergedAudience).toEqual(mergedAudience);
    });

    it('should merge', () => {
      // TODO - fix Segment type
      const mergedAudience = service.merge({ audiences: AudiencesToMerge as any });
      expect(mergedAudience).toEqual(mergedAudience);
    });
  });

  describe('deduplicateIncludesAndExclusion', () => {
    it('should remove all duplicates', () => {
      service.deduplicateIncludesAndExclusion(
        mockDeduplicateAll.spec.targeting.flexible_spec,
        mockDeduplicateAll.spec.targeting.exclusions,
      );
      expect(mockDeduplicateAll.spec.targeting).toMatchSnapshot();
    });

    it('should remove duplicates and null values from exclusion', () => {
      service.deduplicateIncludesAndExclusion(targetingNullSegments.flexible_spec, targetingNullSegments.exclusions);
      expect(targetingNullSegments).toMatchSnapshot();
    });

    it('should remove duplicates and number type segments', () => {
      service.deduplicateIncludes(
        mockDeduplicateIncludes.spec.targeting.flexible_spec,
        mockDeduplicateIncludes.spec.targeting.flexible_spec[0].interests[0],
      );
      expect(mockDeduplicateIncludes.spec.targeting.flexible_spec).toMatchSnapshot();
    });

    it('should remove duplicates and null values', () => {
      service.deduplicateIncludes(flexSpecsNullSegments, flexSpecsNullSegments[0].interests[0]);
      expect(flexSpecsNullSegments).toMatchSnapshot();
    });
  });

  describe('removeIncludesSegmentIfInExclusion', () => {
    it('should remove segment from exclusion if same segment id exists in inclusion', () => {
      [0, 1].forEach((index) => {
        service.removeIncludesSegmentIfInExclusion(
          mockIncludesSegmentIfInExclusion.spec.targeting.exclusions,
          mockIncludesSegmentIfInExclusion.spec.targeting.flexible_spec[index].interests[0],
          'interests',
        );
      });
      expect(mockIncludesSegmentIfInExclusion.spec.targeting.exclusions.interests).toEqual([]);
    });
  });
});
