import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { HistoryService } from '@audience-app/pages/audience-search-page/components/audience-search-input/history.service';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { EmitterService } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { of } from 'rxjs';

describe('HistoryService', () => {
  let historyService: HistoryService;
  let audiencesService: AudiencesService;
  let emitter: EmitterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreTestBedModule.configureTestingModule([AudiencesState])],
      providers: [
        HistoryService,
        {
          provide: AudiencesService,
          useValue: {
            removeSearchHistoryValue: {
              emit: () => {},
            },
            addSearchHistoryValue: {
              emit: () => {},
            },
            setFoundAudiences: {
              emit: () => {},
            },
            setSearchHistory: {
              emit: () => {},
            },
            getAudiencesByKeywords: () => of('something'),
          },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { keywords: 'dev' } } } },
      ],
    }).compileComponents();

    historyService = TestBed.inject(HistoryService);
    audiencesService = TestBed.inject(AudiencesService);
    emitter = TestBed.inject(EmitterService);
  });

  it('should be defined', () => {
    expect(historyService).toBeDefined();
  });

  describe('removeSearchHistoryValue', () => {
    it('should remove searchHistoryValue', () => {
      const spy = jest.spyOn((historyService as any).audiencesService.removeSearchHistoryValue, 'emit');
      historyService.removeSearchHistoryValue('dev');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateSearchHistory', () => {
    it('should set selected keywords to input', () => {
      historyService.updateSearchHistory(['test 1', 'test 2']);
      expect(historyService.selectedKeywords).toEqual(['test 1', 'test 2']);
    });

    it('should addLatestKeywordToSearchHistory with keywords from input', () => {
      const spy = jest.spyOn(historyService as any, 'addLatestKeywordToSearchHistory');
      historyService.updateSearchHistory(['test 1', 'test 2']);
      expect(spy).toBeCalledWith(['test 1', 'test 2']);
    });
  });

  describe('getAudiences', () => {
    it('should reset found audiences', (done) => {
      const spy = jest.spyOn((historyService as any).audiencesService.setFoundAudiences, 'emit');
      historyService.getAudiences([]).subscribe((res) => {
        expect(spy).toBeCalled();
        done();
      });
    });

    it('should call reset audiences but not getAudiencesByKeywords on undefined input', () => {
      const resetFoundAudiencesSpy = jest.spyOn(historyService as any, 'resetFoundAudiences');
      const getAudiencesByKeywordsSpy = jest.spyOn((historyService as any).audiencesService, 'getAudiencesByKeywords');
      historyService.getAudiences();
      expect(resetFoundAudiencesSpy).toBeCalled();
      expect(getAudiencesByKeywordsSpy).not.toBeCalled();
    });

    it('should call getAudiencesByKeywords with keywords from args', (done) => {
      const spy = jest.spyOn((historyService as any).audiencesService, 'getAudiencesByKeywords');
      historyService.getAudiences(['dev']).subscribe((res) => {
        expect(spy).toBeCalledWith({ keywords: ['dev'] });
        done();
      });
    });

    it('should call setFoundAudiences.emit with return from getAudiencesByKeywords', (done) => {
      jest.spyOn(audiencesService, 'getAudiencesByKeywords').mockReturnValue(of('test' as any));
      const spy = jest.spyOn((historyService as any).audiencesService.setFoundAudiences, 'emit');
      historyService.getAudiences(['dev']).subscribe((res) => {
        expect(spy).toBeCalledWith('test');
        done();
      });
    });
  });

  describe('handleParamsKeywords', () => {
    it('should trigger only if params are there', () => {
      const spy = jest.spyOn(historyService as any, 'setSearchHistoryState');
      (historyService as any).route.snapshot.queryParams = {};
      historyService.handleParamsKeywords();
      expect(spy).not.toBeCalled();
    });

    it('should correctly trigger with multiple params', () => {
      (historyService as any).route.snapshot.queryParams.keywords = ['dev', 'eloper'];
      historyService.handleParamsKeywords();

      expect(historyService.selectedKeywords).toEqual(['dev', 'eloper']);
    });

    it('should call setSearchHistoryState', () => {
      const spy = jest.spyOn((historyService as any).audiencesService.setSearchHistory, 'emit');
      historyService.handleParamsKeywords();
      expect(spy).toHaveBeenCalledWith(['dev']);
    });

    it('should return do nothing if params exist without keywords', () => {
      const spy = jest.spyOn((historyService as any).audiencesService.setSearchHistory, 'emit');
      (historyService as any).route.snapshot.queryParams = { other: null };
      historyService.handleParamsKeywords();
      expect(spy).not.toBeCalled();
    });
  });

  describe('subscribeToSearchHistory', () => {
    it('should subscribeToSearchHistory and reverse the order', fakeAsync(() => {
      historyService.subscribeToSearchHistory();
      emitter.action(AudiencesState.setSearchHistory).emit(['dev', 'andy'] as any);
      tick();

      expect(historyService.searchHistory$.value).toEqual(['andy', 'dev']);
    }));

    it('should subscribeToSearchHistory and NOT reverse the order', fakeAsync(() => {
      historyService.subscribeToSearchHistory();
      emitter.action(AudiencesState.setSearchHistory).emit(['dev'] as any);
      tick();

      expect(historyService.searchHistory$.value).toEqual(['dev']);
    }));
  });

  describe('removeAllSelectedKeywords', () => {
    it('should set selected keywords to []', () => {
      historyService.selectedKeywords = ['test', 'test 2'];
      historyService.removeAllSelectedKeywords();
      expect(historyService.selectedKeywords).toEqual([]);
    });
  });
});
