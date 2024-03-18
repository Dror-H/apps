import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { UserState } from '@audience-app/store/user.state';
import { NgxsModule, Store } from '@ngxs/store';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { Component, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';

@Pipe({ name: 'initialsFromUser' })
export class InitialsFromUser implements PipeTransform {
  transform(user: User): string {
    return 'something';
  }
}

@Component({
  selector: 'audi-user-dropdown-menu',
  template: `<div></div>`,
})
export class MockUserDropdownMenuComponent {
  @Input() user: User;
  @Output() signOut = new EventEmitter();
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: Store;
  let authService: AuthService;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, InitialsFromUser, MockUserDropdownMenuComponent],
      imports: [
        NgxsModule.forRoot([UserState]),
        NzButtonModule,
        NzAvatarModule,
        NzSpaceModule,
        NzAffixModule,
        NzLayoutModule,
        NzDropDownModule,
        NzMenuModule,
      ],
      providers: [
        {
          provide: ModalService,
          useValue: {
            openAuthModal: (): void => {},
            openSelectAdAccountModal: (): void => {},
          },
        },
        {
          provide: AuthService,
          useValue: {
            isLoading$: of(false),
            login(): void {
              console.log('loggedIn');
            },
          },
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    modalService = TestBed.inject(ModalService);
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      user: { name: 'Andy', email: 'andy@gmail.com', emailVerified: true, id: '512rfadskjads;', profilePicture: null },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should get the user', (done) => {
    component.userState$.subscribe((user) => {
      expect(user).toEqual({
        email: 'andy@gmail.com',
        emailVerified: true,
        id: '512rfadskjads;',
        name: 'Andy',
        profilePicture: null,
      });
      done();
    });
  });

  it('should init the loading', (done) => {
    component.ngOnInit();
    component.isLoading$.subscribe((loading) => {
      expect(loading).toEqual(false);
      done();
    });
  });

  it('should sign in with facebook', () => {
    const spy = jest.spyOn(authService, 'login');
    component.signInWithFacebook();
    expect(spy).toHaveBeenCalled();
  });

  it('open modal', () => {
    const spy = jest.spyOn(modalService, 'openAuthModal');
    component.openAuthModal('signin');
    expect(spy).toHaveBeenCalled();
  });
});
