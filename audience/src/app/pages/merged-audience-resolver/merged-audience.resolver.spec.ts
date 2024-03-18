import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import * as operators from '../../global/utils/operators';
import { MergedAudienceResolver } from './merged-audience.resolver';

const mockAudiencesService = {
  getAudiencesById: jest.fn(),
};

const mockDisplayNotificationService = {
  displayNotification: jest.fn(),
};

jest.mock('../../global/utils/operators', () => {
  const originalModule = jest.requireActual('../../global/utils/operators');
  return {
    __esModule: true,
    ...originalModule,
    notificationOnErrorOperator: jest.fn().mockReturnValue((v) => v),
  };
});

describe('MergedAudienceResolver', () => {
  let resolver: MergedAudienceResolver;
  let store: Store;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([AudiencesState]), NgxsSelectSnapshotModule.forRoot()],
      providers: [
        { provide: AudiencesService, useValue: mockAudiencesService },
        { provide: DisplayNotificationService, useValue: mockDisplayNotificationService },
      ],
    });
    resolver = TestBed.inject(MergedAudienceResolver);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(resolver).toBeDefined();
  });

  describe('resolve', () => {
    it('should throw error if no selected audiences', () => {
      store.reset({ audiences: { selectedAudiences: [] } });
      resolver.resolve({} as any, {} as any).subscribe();
      expect(operators.notificationOnErrorOperator).toBeCalled();
    });

    it('should navigate to "/"', () => {
      store.reset({ audiences: { selectedAudiences: [] } });
      const spy = jest.spyOn(router, 'navigateByUrl');
      resolver.resolve({} as any, {} as any).subscribe();
      expect(spy).toBeCalledWith('/');
    });

    it('should call audiencesService.getAudiencesById', fakeAsync(() => {
      const mockSelectedAudiences = [{ id: 'test 1' }, { id: 'test 2' }] as any;
      store.reset({ audiences: { selectedAudiences: mockSelectedAudiences } });
      const spy = jest.spyOn((resolver as any).audiencesService, 'getAudiencesById').mockReturnValue(of());
      resolver.resolve({ queryParams: {} } as any, {} as any).subscribe();
      tick();
      expect(spy).toBeCalledWith(['test 1', 'test 2']);
    }));
  });

  describe('getIds', () => {
    it('should return ids of selectedAudiences on no params', () => {
      const mockSelectedAudiences = [{ id: 'test 1' }, { id: 'test 2' }] as any;
      store.reset({ audiences: { selectedAudiences: mockSelectedAudiences } });
      const result = (resolver as any).getIds({ queryParams: {} } as any);
      expect(result).toEqual(['test 1', 'test 2']);
    });

    it('should return id as value at index 0 of an array', () => {
      const result = (resolver as any).getIds({ queryParams: { id: 'test' } } as any);
      expect(result).toEqual(['test']);
    });

    it('should return ids from query params', () => {
      const mockParamIds = [{ id: 'test 1' }, { id: 'test 2' }];
      const result = (resolver as any).getIds({ queryParams: { id: mockParamIds } } as any);
      expect(result).toEqual(mockParamIds);
    });
  });

  describe('onErrorOperators', () => {
    it('should call notificationOnErrorOperator with displayNotificationService', () => {
      (resolver as any).onErrorOperators();
      expect(operators.notificationOnErrorOperator).toBeCalledWith(mockDisplayNotificationService);
    });

    it('should call only complete', fakeAsync(() => {
      throwError(() => new Error('test'))
        .pipe((resolver as any).onErrorOperators())
        .subscribe({
          complete: () => {
            expect(1).toBe(1);
          },
          next: () => {
            expect(1).toBe(2);
          },
          error: () => {
            expect(1).toBe(2);
          },
        });
      tick();
    }));
  });
});
