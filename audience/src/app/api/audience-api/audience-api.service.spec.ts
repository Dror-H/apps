import { SearchResult, SegmentAutoComplete } from '@instigo-app/data-transfer-object';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AudienceApiService } from '@audience-app/api/audience-api/audience-api.service';

describe('AudienceApiService', () => {
  let service: AudienceApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AudienceApiService],
    });
    service = TestBed.inject(AudienceApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should fetch keywords suggestions', () => {
    const expectedKeywordsSuggestions = ['test 1', 'test 2'];
    service.fetchAIKeywordsSuggestions(['test id'], ['test keyword']).subscribe((segments) => {
      expect(segments).toEqual(expectedKeywordsSuggestions);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: `server/search/keywords-suggestions?keywords=test%20keyword&id=test%20id`,
    });

    req.flush(expectedKeywordsSuggestions);
  });

  it('should fetch auto-complete suggestions with limit', () => {
    const expectedSegments: SegmentAutoComplete[] = [{ name: 'test 1' }, { name: 'test 2' }];
    service.fetchAutoCompleteSuggestions(['test']).subscribe((segments) => {
      expect(segments).toEqual(expectedSegments);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: `server/search/segment_auto_complete?keywords=test&limit=25`,
    });

    req.flush(expectedSegments);
  });

  it('should get audiences', () => {
    const expectedAudienceDto: SearchResult[] = [
      {
        id: '1',
        spec: null,
        topics: ['dev', 'it,whatever'],
        rank: 0.9,
        specRatio: { interests: 90, demographics: 10 },
      },
    ];
    service.getAudiences({ keywords: ['developer'] }).subscribe((reach) => {
      expect(reach).toEqual(expectedAudienceDto);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: `/server/search?keywords=developer`,
    });

    req.flush(expectedAudienceDto);
  });
});
