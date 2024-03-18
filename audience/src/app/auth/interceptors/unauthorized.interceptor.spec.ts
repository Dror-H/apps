import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { UserState } from '@audience-app/store/user.state';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UnauthorizedInterceptorService } from './unauthorized.interceptor';

@Injectable()
export class DataMockService {
  ROOT_URL = `http://somewhere.com`;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<string> {
    return this.http.get<string>(`${this.ROOT_URL}/something`);
  }
}

const userMock = {
  name: 'andy',
  email: 'andy@gmial.com',
  emailVerified: true,
  id: 'asdfjasdfh1342',
  profilePicture: 'some url',
  adAccounts: [],
} as UserState;

describe('unauthorizedInterceptor', () => {
  let service: DataMockService;
  let httpController: HttpTestingController;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState]), NgxsEmitPluginModule.forRoot()],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UnauthorizedInterceptorService,
          multi: true,
        },
        DataMockService,
      ],
    });

    store = TestBed.inject(Store);
    service = TestBed.inject(DataMockService);
    httpController = TestBed.inject(HttpTestingController);

    store.reset({
      ...store.snapshot(),
      user: userMock,
    });
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    const user = store.selectSnapshot<string[]>((state) => state.user);

    expect(user).toEqual(userMock);
  });

  it('should intercept correctly 401', fakeAsync(() => {
    const user = store.selectSnapshot<string[]>((state) => state.user);

    service.getPosts().subscribe(
      (resp) => {},
      (err) => {
        const user = store.selectSnapshot<string[]>((state) => state.user);
        expect(user).toEqual(null);
      },
    );

    const req = httpController.expectOne({
      method: 'GET',
      url: `http://somewhere.com/something`,
    });

    req.error(new ErrorEvent('network error'), {
      status: 401,
      statusText: 'Unauthorized',
    });
  }));
});
