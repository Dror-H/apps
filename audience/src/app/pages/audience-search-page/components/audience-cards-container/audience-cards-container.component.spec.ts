import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { currentUserMock } from '@audience-app/auth/auth.mocks';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { UserState } from '@audience-app/store/user.state';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { of } from 'rxjs';
import { AudienceCardsContainerComponent, INCREASE_VISIBLE_CARDS_COUNT_BY } from './audience-cards-container.component';

@Component({ selector: 'audi-audience-card', template: `<div></div>` })
class MockAudienceCardComponent {
  @Input() public audience: SearchResult;
}

@Component({
  selector: 'audi-card-skeleton',
  template: `<div></div>`,
})
export class MockAudienceCardSkeletonComponent {}

@Component({
  selector: 'ingo-explain',
  template: `<div></div>`,
})
export class MockIngoExplainComponent {
  @Input() tooltipId: string;
  @Input() tooltipType = 'default';
}

const mockAudiencesService = {
  addFoundAudiences: { emit: jest.fn() },
  toggleSelectAudience: { emit: jest.fn() },
  selectSingleAudience: { emit: jest.fn() },
  getAudiencesByKeywords: jest.fn().mockReturnValue(of()),
  isLoadingStatic: { emit: jest.fn().mockReturnValue(of(false)) },
};

const mockComponents = [MockIngoExplainComponent, MockAudienceCardComponent, MockAudienceCardSkeletonComponent];

describe('AudienceCardsContainerComponent', () => {
  let component: AudienceCardsContainerComponent;
  let fixture: ComponentFixture<AudienceCardsContainerComponent>;
  let audiencesService: AudiencesService;
  let loadingService: LoadingService;
  let router: Router;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceCardsContainerComponent, ...mockComponents],
      imports: [
        StoreTestBedModule.configureTestingModule([UserState]),
        NgxsSelectSnapshotModule,
        NzGridModule,
        NzButtonModule,
        NzToolTipModule,
        RouterTestingModule.withRoutes([{ path: 'audience-search', component: AudienceCardsContainerComponent }]),
      ],
      providers: [
        { provide: AudiencesService, useValue: mockAudiencesService },
        {
          provide: LoadingService,
          useValue: { isLoadingStatic: { emit: (): null => null } },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceCardsContainerComponent);
    component = fixture.componentInstance;
    audiencesService = TestBed.inject(AudiencesService);
    loadingService = TestBed.inject(LoadingService);
    store = TestBed.inject(Store);
    store.reset({ user: currentUserMock });
    jest.spyOn(store, 'selectSnapshot').mockReturnValue([]);
    router = TestBed.inject(Router);
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call subscribeToParamsForKeywords', () => {
      const spy = jest.spyOn(component as any, 'subscribeToParamsForKeywords');
      component.ngOnInit();
      expect(spy).toBeCalled();
    });
    it('should call subscribeToLoadMore', () => {
      const spy = jest.spyOn(component as any, 'subscribeToLoadMore');
      component.ngOnInit();
      expect(spy).toBeCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on subscription', () => {
      const spy = jest.spyOn((component as any).subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(spy).toBeCalled();
    });
  });

  describe('toggleSelectAudience', () => {
    it('should call audienceService.toggleSelectAudience.emit with selectedAudience', () => {
      const spy = jest.spyOn(audiencesService.toggleSelectAudience, 'emit');
      component.toggleSelectAudience({} as SearchResult);
      expect(spy).toBeCalled();
    });
  });

  describe('isAudienceSelected', () => {
    it('should return true', () => {
      const mockAudience = { id: 1 } as unknown as SearchResult;
      jest.spyOn(store, 'selectSnapshot').mockReturnValue([mockAudience]);
      expect(component.isAudienceSelected(mockAudience)).toBeTruthy();
    });

    it('should return false', () => {
      const mockAudience1 = { id: 1 } as unknown as SearchResult;
      jest.spyOn(store, 'selectSnapshot').mockReturnValue([mockAudience1]);
      const mockAudience2 = { id: 2 } as unknown as SearchResult;
      expect(component.isAudienceSelected(mockAudience2)).toBeFalsy();
    });
  });

  describe('loadMoreAudiences', () => {
    it('should call next on loadMore$', () => {
      const spy = jest.spyOn((component as any).loadMore$, 'next');
      component.loadMoreAudiences();
      expect(spy).toBeCalled();
    });
  });

  describe('subscribeToIsLoading', () => {
    it('should call ad on subscription', () => {
      const spy = jest.spyOn((component as any).subscription, 'add');
      (component as any).subscribeToIsLoading();
      expect(spy).toBeCalled();
    });

    it('should set isLoadingMore true if isLoadingAudiences', () => {});
    it('should set isLoadingMore true if isLoadingStatic', () => {});
  });

  describe('subscribeToParamsForKeywords', () => {
    it('should resetVisibleCardsCount', () => {
      const spy = jest.spyOn(component as any, 'resetVisibleCardsCount');
      (component as any).subscribeToParamsForKeywords();
      expect(spy).toBeCalled();
    });
  });

  describe('resetVisibleCardsCount', () => {
    it('should reset visibleCardsCount to INCREASE_VISIBLE_CARDS_COUNT_BY', () => {
      component.visibleCardsCount = INCREASE_VISIBLE_CARDS_COUNT_BY * 2;
      (component as any).resetVisibleCardsCount();
      expect(component.visibleCardsCount).toBe(INCREASE_VISIBLE_CARDS_COUNT_BY);
    });
  });

  describe('increaseVisibleCardsCount', () => {
    it('should reset increaseVisibleCardsCount by adding INCREASE_VISIBLE_CARDS_COUNT_BY', () => {
      (component as any).increaseVisibleCardsCount();
      expect(component.visibleCardsCount).toBe(INCREASE_VISIBLE_CARDS_COUNT_BY * 2);
    });
  });

  describe('subscribeToLoadMore', () => {
    it('should call subscription.add', () => {
      const spy = jest.spyOn((component as any).subscription, 'add');
      (component as any).subscribeToLoadMore();
      expect(spy).toBeCalled();
    });

    it('should call getNewAudiencesIfFoundExceedLimit', () => {
      const spy = jest.spyOn(component as any, 'getNewAudiencesIfFoundExceedLimit');
      (component as any).subscribeToLoadMore();
      (component as any).loadMore$.next();
      expect(spy).toBeCalled();
    });

    it('should call increaseVisibleCardsCount', () => {
      jest.spyOn(component as any, 'getNewAudiencesIfFoundExceedLimit').mockReturnValue(of(null));
      const spy = jest.spyOn(component as any, 'increaseVisibleCardsCount');
      (component as any).subscribeToLoadMore();
      component.loadMoreAudiences();
      expect(spy).toBeCalled();
    });
  });

  describe('getAudiencesByKeywords', () => {
    it('should call this.audiencesService.getAudiencesByKeywords with selectedKeywords and visibleCardsCount', () => {
      (component as any).getAudiencesByKeywords();
      const spy = jest.spyOn(audiencesService, 'getAudiencesByKeywords');
      expect(spy).toBeCalledWith({ keywords: [], offset: 6 });
    });

    it('should call audiencesService.addFoundAudiences.emit with audiences received', (done) => {
      const spy = jest.spyOn(audiencesService.addFoundAudiences, 'emit');
      jest.spyOn(audiencesService, 'getAudiencesByKeywords').mockReturnValue(of('test' as any));
      (component as any).getAudiencesByKeywords().subscribe((data) => {
        expect(spy).toHaveBeenCalledWith('test');
        done();
      });
    });
  });

  describe('getNewAudiencesIfFoundExceedLimit', () => {
    it('should call onStaticLoading', () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValue(new Array(20));
      const spy = jest.spyOn(component as any, 'onStaticLoading');
      (component as any).getNewAudiencesIfFoundExceedLimit();
      expect(spy).toBeCalled();
    });
    it('should return getAudiencesByKeywords return value', () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValue([]);
      jest.spyOn(component as any, 'getAudiencesByKeywords').mockReturnValue('test');
      const result = (component as any).getNewAudiencesIfFoundExceedLimit();
      expect(result).toBe('test');
    });
  });

  describe('onStaticLoading', () => {
    it('should return null', (done) => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValue([]);
      (component as any).onStaticLoading().subscribe((data) => {
        expect(data).toBeNull();
        done();
      });
    });

    it('should set loadingStatic true then false', (done) => {
      jest.clearAllMocks();
      const spy = jest.spyOn(loadingService.isLoadingStatic, 'emit');
      jest.spyOn(store, 'selectSnapshot').mockReturnValue([]);
      (component as any).onStaticLoading().subscribe((data) => {
        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0][0]).toBe(true);
        expect(spy.mock.calls[1][0]).toBe(false);
        done();
      });
    });
  });
});
