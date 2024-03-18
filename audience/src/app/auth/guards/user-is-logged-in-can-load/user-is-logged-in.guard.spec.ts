import { TestBed } from '@angular/core/testing';
import { DefaultUrlSerializer, Route, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { UserState } from '@audience-app/store/user.state';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { UserIsLoggedInGuard } from './user-is-logged-in.guard';

describe('UserIsLoggedInGuard', () => {
  let guard: UserIsLoggedInGuard;
  let modalService: ModalService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserState]), NgxsSelectSnapshotModule, RouterTestingModule],
      providers: [
        {
          provide: ModalService,
          useValue: {
            openAuthModal: () => ({
              afterClose: of(null),
            }),
          },
        },
      ],
    });
    guard = TestBed.inject(UserIsLoggedInGuard);
    modalService = TestBed.inject(ModalService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true', () => {
    store.reset({ user: {} });
    const result = guard.canLoad({} as Route, [] as UrlSegment[]);
    expect(result).toBe(true);
  });

  it('should call modalService.openAuthModal with "signin"', () => {
    const spy = jest.spyOn(modalService, 'openAuthModal');
    store.reset({ user: null });
    void guard.canLoad({} as Route, [] as UrlSegment[]);
    expect(spy).toBeCalledWith('signin');
  });

  it('should return home url', (done) => {
    store.reset({ user: null });
    const subReturn = guard.canLoad({} as Route, [] as UrlSegment[]) as unknown;
    (subReturn as Observable<string | null>).subscribe((result) => {
      const homeUrlTree = new DefaultUrlSerializer().parse('');
      expect(result).toEqual(homeUrlTree);
      done();
    });
  });
});
