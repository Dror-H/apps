import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { of } from 'rxjs';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthAction } from '@audience-app/auth/auth.models';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';

@Pipe({ name: 'textFromAuthAction' })
export class TextFromAuthActionMock implements PipeTransform {
  transform(authAction: AuthAction, opposite?: boolean, isQuestion?: boolean): string {
    return 'something';
  }
}

describe('AuthComponent', () => {
  let fixture: ComponentFixture<AuthComponent>;
  let component: AuthComponent;
  let modalService: ModalService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent, TextFromAuthActionMock],
      imports: [CommonModule, NzButtonModule, StoreTestBedModule.configureTestingModule([])],
      providers: [
        {
          provide: ModalService,
          useValue: {
            closeModal() {},
            openSelectAdAccountModal() {},
          },
        },
        {
          provide: AuthService,
          useValue: {
            login() {},
            logout() {},
          },
        },
      ],
    });

    modalService = TestBed.inject(ModalService);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should close the modal', () => {
    const spy = jest.spyOn(modalService, 'closeModal');
    component.closeModal();

    expect(spy).toHaveBeenCalled();
  });

  it('should execute signin', () => {
    const spy = jest.spyOn(authService, 'login');
    component.authAction = 'signin';
    component.executeAuthAction();

    expect(spy).toHaveBeenCalled();
  });

  it('should execute signin', () => {
    const spy = jest.spyOn(authService, 'logout');
    component.authAction = 'signout';
    component.executeAuthAction();

    expect(spy).toHaveBeenCalled();
  });
});
