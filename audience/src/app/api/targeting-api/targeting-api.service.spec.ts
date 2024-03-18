import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TargetingTemplateState } from '@app/models/targeting-template.model';
import { SearchParams, TargetingApiService } from '@audience-app/api/targeting-api/targeting-api.service';
import {
  AdAccountDTO,
  BrowseOutput,
  CampaignDTO,
  InstigoTargetingTypes,
  ReachOutputDto,
  SearchOutputDto,
  SupportedProviders,
  TargetingDto,
  UserTargetings,
} from '@instigo-app/data-transfer-object';

describe('TargetingApiService', () => {
  let service: TargetingApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [TargetingApiService] });
    service = TestBed.inject(TargetingApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should fetch reach', () => {
    const expectedReach: ReachOutputDto = {
      count: 31432,
      estimateReady: true,
      targetingStatus: 'fasdfas',
      active: 234124321,
    };
    const adAccountId = 'act_dsafasdfasd';
    SupportedProviders.FACEBOOK;

    service
      .reach({ adAccountId, provider: SupportedProviders.FACEBOOK, targeting: {} as TargetingTemplateState })
      .subscribe((reach) => {
        expect(reach).toEqual(expectedReach);
      });
    const req = httpController.expectOne({
      method: 'POST',
      url: `server/targeting/reach/${adAccountId}`,
    });

    req.flush(expectedReach);
  });

  it('should fetch browse', () => {
    const expectedBrowse: BrowseOutput = {
      id: 234124321,
    };
    const adAccountId = 'act_dsafasdfasd';

    service.browse({ adAccountId }).subscribe((reach) => {
      expect(reach).toEqual(expectedBrowse);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: `server/targeting/browse/${adAccountId}`,
    });

    req.flush(expectedBrowse);
  });

  describe('search', () => {
    it('should call handleSearchParams', () => {
      const spy = jest.spyOn(service as any, 'handleSearchParams');
      const params = { provider: SupportedProviders.FACEBOOK, searchQuery: 'test' };
      service.search(params);
      expect(spy).toBeCalledWith(params);
    });

    it('should fetch search results', () => {
      const params = { provider: SupportedProviders.FACEBOOK, searchQuery: 'test' };
      const expectedSearchResult: SearchOutputDto[] = [
        { name: 'test', providerId: 'test', type: InstigoTargetingTypes.AGE_RANGE },
      ];

      service.search(params).subscribe((searchResult) => {
        expect(searchResult).toEqual(expectedSearchResult);
      });

      const req = httpController.expectOne({
        method: 'GET',
        url: `server/targeting/search?provider=facebook&searchQuery=test`,
      });

      req.flush(expectedSearchResult);
    });
  });

  it('should put suggestions', () => {
    const adAccountProviderId = 'test123';
    const expectedSuggestions: SearchOutputDto[] = [
      { name: 'test', providerId: 'test', type: InstigoTargetingTypes.AGE_RANGE },
    ];
    const options = {
      adAccountProviderId,
      provider: SupportedProviders.FACEBOOK,
      targeting: [],
    };
    service.suggestions(options).subscribe((suggestions) => {
      expect(suggestions).toEqual(expectedSuggestions);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: `server/targeting/suggestions/${adAccountProviderId}`,
    });

    req.flush(expectedSuggestions);
  });

  it('should save user targeting', () => {
    const expectedUserTargeting: UserTargetings[] = [
      { userId: 'test123', assignedAt: new Date(), targetingId: 'test123' },
    ];
    const options = {
      name: 'test',
      userTags: ['test tag 1', 'test tag 2'],
      targeting: {} as TargetingDto,
    };
    service.saveUserTargeting(options).subscribe((suggestions) => {
      expect(suggestions).toEqual(expectedUserTargeting);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: `server/targeting/save`,
    });

    req.flush(expectedUserTargeting);
  });

  it('should save and export user targeting', () => {
    const expectedResponse = [{ campaign: {} as CampaignDTO, adSet: {} }];
    const options = {
      name: 'test',
      userTags: ['test tag 1', 'test tag 2'],
      targeting: {} as TargetingDto,
      adAccount: {} as AdAccountDTO,
    };
    service.saveAndExportTargeting(options).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: `server/targeting/save_and_export`,
    });

    req.flush(expectedResponse);
  });

  it('should saveUserTargetingAndExportToFacebook', () => {
    const expectedUserTargeting: UserTargetings = { userId: 'test123', assignedAt: new Date(), targetingId: 'test123' };
    const options = {
      name: 'test',
      userTags: ['test tag 1', 'test tag 2'],
      targeting: {} as TargetingDto,
      adAccountProviderId: 'test adAccountProviderId',
    };
    service.saveUserTargetingAndExportToFacebook(options).subscribe((suggestions) => {
      expect(suggestions).toEqual(expectedUserTargeting);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: `server/targeting/save_and_export`,
    });

    req.flush(expectedUserTargeting);
  });

  it('should handleSearchParams', () => {
    const searchParams: SearchParams = {
      searchQuery: 'test',
      provider: SupportedProviders.FACEBOOK,
      adAccountId: 'test adAccountId',
      providerSubType: false,
    };
    (service as any).handleSearchParams(searchParams);
    expect(searchParams).toEqual({
      searchQuery: 'test',
      provider: SupportedProviders.FACEBOOK,
      adAccountProviderId: 'test adAccountId',
    });
  });
});
