import { SegmentDetailsService } from '@audiences-api/segments/segment-details.service';
import { SegmentsService } from '@audiences-api/segments/segments.service';
import { Test } from '@nestjs/testing';
import { SearchUtils } from './search-utils';
import { SearchService } from './search.service';

describe('Search Test suite', () => {
  let service: SearchService;
  let segmentsService: SegmentsService;
  let segmentDetailsService: SegmentDetailsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: 'PrismaService',
          useValue: {
            facebookSegment: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        { provide: 'SynonymsService', useValue: {} },
        { provide: 'ThirdPartyAudienceApiService', useValue: {} },
        { provide: 'EventEmitter', useValue: {} },
        { provide: 'ConfigService', useValue: {} },
        {
          provide: 'SegmentsService',
          useValue: {
            getSegmentsTargetingValidation: () => {},
            getSegmentsTargetingValidationFromIds: () => {},
            getSegmentsTargetingStatusNormalIds: () => {},
          },
        },
        { provide: 'SearchFallBackService', useValue: {} },
        {
          provide: 'SegmentDetailsService',
          useValue: {
            appendDetailsOnSegments: () => {},
            appendSegmentRatios: () => {},
          },
        },
        { provide: 'SearchRepository', useValue: {} },
        { provide: 'MergeTargetingsService', useValue: {} },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    segmentsService = module.get<SegmentsService>(SegmentsService);
    segmentDetailsService = module.get<SegmentDetailsService>(SegmentDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAudiencesWithMin5Segments', () => {
    it('should filter audiences without targeting', () => {
      const mockAudiences = [{ spec: { targeting: { flexible_spec: [], exclusions: undefined } } }];
      const result = (service as any).getAudiencesWithMin5Segments(mockAudiences);
      expect(result).toEqual([]);
    });
    it('should filter audiences without flexSpecs but with empty exclusions', () => {
      const mockAudiences = [{ spec: { targeting: { flexible_spec: [], exclusions: {} } } }];
      const mockAudiences2 = [{ spec: { targeting: { flexible_spec: [{ interests: [] }], exclusions: {} } } }];
      const result = (service as any).getAudiencesWithMin5Segments(mockAudiences);
      const result2 = (service as any).getAudiencesWithMin5Segments(mockAudiences2);
      expect(result).toEqual([]);
      expect(result2).toEqual([]);
    });
    it('should return audiences with more than 5 segments in flexible_spec', () => {
      const mockAudiences = [
        {
          spec: {
            targeting: {
              flexible_spec: [
                {
                  interests: [{ id: 1 }, { id: 4 }, { id: 5 }],
                  work_positions: [{ id: 2 }],
                  demographics: [{ id: 3 }],
                },
              ],
              exclusions: {},
            },
          },
        },
      ];
      const result = (service as any).getAudiencesWithMin5Segments(mockAudiences, true);
      expect(result).toEqual(mockAudiences);
    });
    it('should return disregard segments in exclusions', () => {
      const mockAudiences = [
        {
          spec: {
            targeting: {
              flexible_spec: [
                {
                  interests: [{ id: 1 }, { id: 4 }, { id: 5 }],
                },
              ],
              exclusions: {
                interests: [{ id: 6 }, { id: 7 }, { id: 8 }],
                work_positions: [{ id: 2 }],
                demographics: [{ id: 3 }],
              },
            },
          },
        },
      ];
      const result = (service as any).getAudiencesWithMin5Segments(mockAudiences, true);
      expect(result).toEqual([]);
    });
  });

  describe('enhanceAudiences', () => {
    it('should call removeInvalidTypeSegments', () => {
      const spy = jest.spyOn(SearchUtils as any, 'removeInvalidTypeSegments');
      (service as any).enhanceAudiences([]);
      expect(spy).toBeCalledWith([]);
    });
  });
});
