import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { TargetingDto } from '@instigo-app/data-transfer-object';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;
  let nzModalService: NzModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        { provide: NzModalService, useValue: { create: () => 'modal create test', confirm: () => {} } },
        { provide: AuthService, useValue: { login: () => 'login test' }, logout: () => 'logout test' },
        ModalService,
      ],
    });
    service = TestBed.inject(ModalService);
    nzModalService = TestBed.inject(NzModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openAuthModal', () => {
    it('should set modal ref with return from modal.create', () => {
      service.openAuthModal('signin');
      expect((service as any)._modalRef).toBe('modal create test');
    });
  });
  describe('openAdAccountSelectorModal', () => {
    it('should set modal ref with return from modal.create', () => {
      service.openAdAccountSelectorModal({} as TargetingDto);
      expect((service as any)._modalRef).toBe('modal create test');
    });
  });

  describe('openOnOk', () => {
    it('should call confirm on modal service', () => {
      const spy = jest.spyOn(nzModalService, 'confirm');
      const linkToFacebook = 'test';
      service.openOnOK(linkToFacebook);
      expect(spy).toBeCalled();
    });
  });

  describe('closeModal', () => {
    it('should do nothing', () => {
      (service as any)._modalRef = null;
      service.closeModal();
      expect((service as any)._modalRef).toBeNull();
    });

    it('should call close on _modalRef', () => {
      const spy = jest.fn();
      (service as any)._modalRef = { close: spy };
      service.closeModal();
      expect(spy).toBeCalled();
    });
  });
});
