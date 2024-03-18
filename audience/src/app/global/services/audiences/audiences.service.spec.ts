import { TestBed } from '@angular/core/testing';
import { AudienceApiService } from '@audience-app/api/audience-api/audience-api.service';
import { TargetingApiService } from '@audience-app/api/targeting-api/targeting-api.service';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { AdAccountDTO, SearchResult, TargetingDto } from '@instigo-app/data-transfer-object';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import * as operators from '@audience-app/global/utils/operators';
import { Observable, of, throwError } from 'rxjs';
import { EmitterService, NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { Store } from '@ngxs/store';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';

jest.mock('../../global/utils/operators', () => {
  const originalModule = jest.requireActual('../../global/utils/operators');
  return {
    __esModule: true,
    ...originalModule,
    notificationOnSuccessOperator: jest.fn().mockReturnValue((v) => v),
    notificationOnErrorOperator: jest.fn().mockReturnValue((v) => v),
  };
});

jest.mock('../../global/services/audiences/audiences.service', () => {
  const originalModule = jest.requireActual('../../global/services/audiences/audiences.service');
  return {
    __esModule: true,
    ...originalModule,
    getAudiences: () => {},
    setFoundAudiences: { emit: () => of(null) },
    addFoundAudiences: { emit: () => of(null) },
    setSelectedAudiences: { emit: () => of(null) },
    toggleSelectAudience: { emit: () => of(null) },
    addSearchHistoryValue: { emit: () => of(null) },
    setSearchHistory: { emit: () => of(null) },
    removeSearchHistoryValue: { emit: () => of(null) },
  };
});

describe('AudienceService', () => {
  let service: AudiencesService;
  let targetingApiService: TargetingApiService;
  let loadingService: LoadingService;
  let audienceApiService: AudienceApiService;
  let emitter: EmitterService;
  let store: Store;

  const mockAudienceApiService: Partial<AudienceApiService> = {
    getAudiences: () => of([]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestBedModule.configureTestingModule([AudiencesState]), NgxsEmitPluginModule.forRoot()],
      providers: [
        AudiencesService,
        { provide: AudienceApiService, useValue: mockAudienceApiService },
        { provide: DisplayNotificationService, useValue: { displayNotification: (): void => {} } },
        {
          provide: TargetingApiService,
          useValue: { saveUserTargeting: () => of(null), saveAndExportTargeting: () => of(null) },
        },
        {
          provide: LoadingService,
          useValue: { isLoadingMergedAudience: { emit: () => {} }, isLoadingAudiences: { emit: () => {} } },
        },
      ],
    });
    service = TestBed.inject(AudiencesService);
    targetingApiService = TestBed.inject(TargetingApiService);
    loadingService = TestBed.inject(LoadingService);
    audienceApiService = TestBed.inject(AudienceApiService);
    emitter = TestBed.inject(EmitterService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO - find a way to test if the emitters are called
  describe('resetAudiences', () => {
    it('should call setFoundAudiences.emit with []', () => {
      store.reset({ audiences: { foundAudiences: null } });
      service.resetAudiences();
      const foundAudiences = store.selectSnapshot(AudiencesState.getFoundAudiences);
      expect(foundAudiences).toEqual([]);
    });
  });
  describe('resetSelectedAudiences', () => {
    it('should call setSelectedAudiences.emit with []', () => {
      store.reset({ audiences: { selectedAudiences: null } });
      service.resetSelectedAudiences();
      const foundAudiences = store.selectSnapshot(AudiencesState.getSelectedAudiences);
      expect(foundAudiences).toEqual([]);
    });
  });
  describe('resetFoundAudiences', () => {
    it('should call setFoundAudiences.emit with null', () => {
      store.reset({ audiences: { foundAudiences: [] } });
      service.resetFoundAudiences();
      const foundAudiences = store.selectSnapshot(AudiencesState.getFoundAudiences);
      expect(foundAudiences).toBeNull();
    });
  });

  describe('getAudiencesById', () => {
    it('should call getAudiences with {id: ids[] }', () => {
      const spy = jest.spyOn(service as any, 'getAudiences');
      const mockIds = ['test 1', 'test 2'];
      service.getAudiencesById(mockIds);
      expect(spy).toBeCalledWith({ id: mockIds });
    });
  });

  describe('getAudiencesByKeywords', () => {
    it('should call getAudiences with lowerCased params', () => {
      const spy = jest.spyOn(service as any, 'getAudiences');
      service.getAudiencesByKeywords({ keywords: ['TesT 1', 'TEST 2'], offset: 2 });
      expect(spy).toBeCalledWith({ keywords: ['test 1', 'test 2'], offset: 2 });
    });
  });

  describe('saveAudience', () => {
    const params = { name: 'test', targeting: {} as TargetingDto, userTags: ['test 1', 'test 2'] };

    it('should call targetingApiService.saveUserTargeting with params', () => {
      const spy = jest.spyOn(targetingApiService, 'saveUserTargeting');
      service.saveAudience(params);
      expect(spy).toBeCalledWith(params);
    });

    it('should call notificationOnSuccessOperator', () => {
      const spy = jest.spyOn(operators, 'notificationOnSuccessOperator');
      service.saveAudience(params);
      expect(spy).toBeCalled();
    });

    it('should call notificationOnErrorOperator', () => {
      jest.spyOn(targetingApiService, 'saveUserTargeting').mockReturnValue(throwError('test'));
      const spy = jest.spyOn(operators, 'notificationOnErrorOperator');
      service.saveAudience(params);
      expect(spy).toBeCalled();
    });
  });

  describe('exportAudience', () => {
    const params = {
      name: 'test',
      targeting: {} as TargetingDto,
      userTags: ['test 1', 'test 2'],
      adAccount: {} as AdAccountDTO,
    };
    it('should call targetingApiService.saveAndExportTargeting with params', () => {
      const spy = jest.spyOn(targetingApiService, 'saveAndExportTargeting');
      service.exportAudience(params);
      expect(spy).toBeCalledWith(params);
    });

    it('should call notificationOnSuccessOperator', () => {
      const spy = jest.spyOn(operators, 'notificationOnSuccessOperator');
      service.exportAudience(params);
      expect(spy).toBeCalled();
    });

    it('should call notificationOnErrorOperator', () => {
      jest.spyOn(targetingApiService, 'saveUserTargeting').mockReturnValue(throwError('test'));
      const spy = jest.spyOn(operators, 'notificationOnErrorOperator');
      service.exportAudience(params);
      expect(spy).toBeCalled();
    });
  });

  describe('setLoadingStateOnGetAudiences', () => {
    it('should call loadingService.isLoadingMergedAudience.emit with loadingState', () => {
      const spy = jest.spyOn(loadingService.isLoadingMergedAudience, 'emit');
      service.setLoadingStateOnGetAudiences({ id: ['1'] }, false);
      expect(spy).toBeCalledWith(false);
      service.setLoadingStateOnGetAudiences({ id: ['1'] }, true);
      expect(spy).toBeCalledWith(true);
    });
    it('should call loadingService.isLoadingAudiences.emit with loadingState', () => {
      const spy = jest.spyOn(loadingService.isLoadingAudiences, 'emit');
      service.setLoadingStateOnGetAudiences({ keywords: ['test 1', 'test 2'] }, false);
      expect(spy).toBeCalledWith(false);
      service.setLoadingStateOnGetAudiences({ keywords: ['test 1', 'test 2'] }, true);
      expect(spy).toBeCalledWith(true);
    });

    it('should do nothing', () => {
      const isLoadingMergedAudienceSpy = jest.spyOn(loadingService.isLoadingMergedAudience, 'emit');
      const isLoadingAudiencesSpy = jest.spyOn(loadingService.isLoadingAudiences, 'emit');
      service.setLoadingStateOnGetAudiences({});
      expect(isLoadingMergedAudienceSpy).not.toBeCalled();
      expect(isLoadingAudiencesSpy).not.toBeCalled();
    });

    it('should call emit on both isLoadingMergedAudience and isLoadingAudiences', () => {
      const isLoadingMergedAudienceSpy = jest.spyOn(loadingService.isLoadingMergedAudience, 'emit');
      const isLoadingAudiencesSpy = jest.spyOn(loadingService.isLoadingAudiences, 'emit');
      service.setLoadingStateOnGetAudiences({ keywords: ['test 1', 'test 2'], id: ['1'] }, true);
      expect(isLoadingMergedAudienceSpy).toBeCalledWith(true);
      expect(isLoadingAudiencesSpy).toBeCalledWith(true);
    });
  });

  describe('getAudiences', () => {
    const params = {
      name: 'test',
      targeting: {} as TargetingDto,
      userTags: ['test 1', 'test 2'],
    };
    it('should call setLoadingStateOnGetAudiences with params and true', () => {
      const spy = jest.spyOn(service, 'setLoadingStateOnGetAudiences');
      (service as any).getAudiences(params);
      expect(spy).toBeCalledWith(params, true);
    });
    it('should call audienceApiService.getAudiences with params', () => {
      const spy = jest.spyOn(audienceApiService, 'getAudiences');
      (service as any).getAudiences(params);
      expect(spy).toBeCalledWith(params);
    });

    it('should call notificationOnErrorOperator', () => {
      jest.spyOn(audienceApiService, 'getAudiences').mockReturnValue(throwError('test'));
      const spy = jest.spyOn(operators, 'notificationOnErrorOperator');
      (service as any).getAudiences(params);
      expect(spy).toBeCalled();
    });
    it('should call setLoadingStateOnGetAudiences with params and false', (done) => {
      jest.spyOn(audienceApiService, 'getAudiences').mockReturnValue(of([]));
      const spy = jest.spyOn(service, 'setLoadingStateOnGetAudiences');
      ((service as any).getAudiences(params) as Observable<SearchResult[]>).subscribe((res) => {
        expect(spy).toBeCalledWith(params, false);
        done();
      });
    });
    it('should call setLoadingStateOnGetAudiences with params and false on error', (done) => {
      jest.spyOn(audienceApiService, 'getAudiences').mockReturnValue(throwError('test'));
      const spy = jest.spyOn(service, 'setLoadingStateOnGetAudiences');
      ((service as any).getAudiences(params) as Observable<SearchResult[]>).subscribe({
        error: (res) => {
          expect(spy).toBeCalledWith(params, false);
          done();
        },
      });
    });
  });
});
