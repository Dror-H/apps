import { Test } from '@nestjs/testing';
import { SegmentDetailsService } from './segment-details.service';
import { mockFlexibleSpecDuplicateByPathAndName } from './testing-data/duplicate-by-path-and-name-spec.data';
import { dbSpec, mockFlexibleSpec } from './testing-data/flexible-spec.mock.data';

describe('SegmentDetails Test suite', () => {
  let service: SegmentDetailsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SegmentDetailsService,
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
        { provide: 'SegmentsService', useValue: {} },
        { provide: 'SearchFallBackService', useValue: {} },
      ],
    }).compile();

    service = module.get<SegmentDetailsService>(SegmentDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get segment ratio', () => {
    const ratio = (service as any).getSegmentRatio(mockFlexibleSpec);
    expect(ratio).toMatchSnapshot();
  });

  it('should get segment ratio', () => {
    expect((service as any).getSegmentRatio(dbSpec.targeting.flexible_spec[0])).toMatchSnapshot();
  });

  describe('removeSegmentsDoubles', () => {
    it('should removeSegmentsDoubles by path and name', () => {
      (service as any).removeSegmentsDoubles(mockFlexibleSpecDuplicateByPathAndName);
      expect(mockFlexibleSpecDuplicateByPathAndName).toMatchSnapshot();
    });
  });

  it('should extract segments from audiences', () => {
    const segments = service.getSegmentsWithIdAndName({ specs: [{ spec: dbSpec } as any] });
    expect(segments).toMatchSnapshot('valid_segments');
  });
});
