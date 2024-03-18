import { Location } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { mockSearchResultsForTags, regularSearchResult } from '@audience-app/pages/audience-edit-page/mocks';
import { createRulesFromTargeting } from '@audience-app/pages/audience-edit-page/utils';
import { mockRegularTargeting } from '@audience-app/pages/audience-edit-page/utils/audience-rules/test-data';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { UserState } from '@audience-app/store/user.state';
import { AudienceType, SupportedProviders, TargetingDto } from '@instigo-app/data-transfer-object';
import { ControlValueAccessorBaseHelper, SelectTagsConfig, STORE } from '@instigo-app/ui/shared';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule, Store } from '@ngxs/store';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { of, throwError } from 'rxjs';
import { AudienceEditPageComponent } from './audience-edit-page.component';

class MockActivatedRoute {
  snapshot = { data: [[regularSearchResult]], queryParams: {} };
}

@Component({
  selector: 'ingo-facebook-saved-audience-targeting',
  template: ` <div></div>`,
})
export class MockFacebookSavedAudienceTargetingComponent {
  @Input() audienceForm: FormGroup;
  @Input() adAccountControl: FormControl;
  @Input() rules: TargetingDto; //* setter in original component
}

@Component({
  template: ` <div></div>`,
  selector: 'ingo-location-selector',
})
export class MockLocationSelectorComponent {
  @Input() provider: SupportedProviders;
}

@Component({
  template: ` <div></div>`,
  selector: 'ingo-audience-summary',
})
export class MockAudienceSummaryComponent {
  @Input() audienceForm: FormGroup;
  @Input() isOverviewActive: boolean;
  @Input() sticky: boolean;
}

@Component({
  template: ` <div></div>`,
  selector: 'ingo-select-tags',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MockSelectTagsComponent),
    },
  ],
})
export class MockSelectTagsComponent extends ControlValueAccessorBaseHelper {
  @Input() config: { disabled: boolean };

  constructor() {
    super();
  }
}

@Component({
  template: ` <div></div>`,
  selector: 'audi-audience-search-page',
})
export class MockAudienceSearchPageComponent {}

@Component({
  selector: 'ingo-explain',
  template: ` <div></div>`,
})
export class MockIngoExplainComponent {
  @Input() tooltipId: string;
  @Input() tooltipType = 'default';
}

const audienceFormValuesMock = {
  audienceType: [AudienceType.SAVED_AUDIENCE],
  audienceSubType: [null, []],
  adAccount: '',
  provider: [SupportedProviders.FACEBOOK],
  description: '',
  name: '',
  reach: '',
  target: [],
  userTags: [],
};

const mockAudiencesService = {
  saveAudience: jest.fn(),
  exportAudience: jest.fn().mockReturnValue(of(true)),
  getAudiencesById: jest.fn().mockReturnValue(of()),
  setFoundAudiences: { emit: jest.fn() },
  setSelectedAudiences: { emit: jest.fn() },
  resetSelectedAudiences: jest.fn(),
};
const mockDisplayNotificationService = { displayNotification: jest.fn() };
const mockComponents = [
  MockFacebookSavedAudienceTargetingComponent,
  MockLocationSelectorComponent,
  MockAudienceSummaryComponent,
  MockSelectTagsComponent,
  MockAudienceSearchPageComponent,
  MockIngoExplainComponent,
];

describe('AudienceEditPageComponent', () => {
  let component: AudienceEditPageComponent;
  let fixture: ComponentFixture<AudienceEditPageComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let audiencesService: AudiencesService;
  let modalService: ModalService;
  let loadingService: LoadingService;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceEditPageComponent, ...mockComponents],
      imports: [
        ReactiveFormsModule,
        NgxsSelectSnapshotModule,
        NgxsModule.forRoot([AudiencesState, UserState]),
        NzGridModule,
        NzCardModule,
        NzAffixModule,
        NzButtonModule,
        NzModalModule,
        RouterTestingModule.withRoutes([
          { path: 'audience-search', component: MockAudienceSearchPageComponent },
          { path: 'audience-edit', component: AudienceEditPageComponent },
        ]),
      ],
      providers: [
        { provide: STORE, useExisting: Store },
        {
          provide: AudiencesService,
          useValue: mockAudiencesService,
        },
        {
          provide: DisplayNotificationService,
          useValue: mockDisplayNotificationService,
        },
        {
          provide: LoadingService,
          useValue: { isSavingAudience: { emit: jest.fn() } },
        },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        {
          provide: ModalService,
          useValue: {
            openAdAccountSelectorModal: () => ({ afterClose: of('test') }),
            openOnOK: () => {},
          },
        },
      ],
    }).compileComponents();
    TestBed.inject(Location);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(ModalService);
    loadingService = TestBed.inject(LoadingService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    store = TestBed.inject(Store);
    await router.navigateByUrl('audience-edit');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceEditPageComponent);
    component = fixture.componentInstance;
    audiencesService = fixture.debugElement.injector.get(AudiencesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should call subscriptions.unsubscribe', () => {
      const spy = jest.spyOn((component as any).subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(spy).toBeCalled();
    });
  });

  describe('goBack', () => {
    it('should call router.navigateByUrl with "/" if audience is saved', () => {
      const spy = jest.spyOn((component as any)._router, 'navigateByUrl');
      component.isAudienceSaved = true;
      component.goBack();
      expect(spy).toBeCalledWith('/');
    });

    it('should call router.navigateByUrl with "/" if audience is not saved and location navigationId === 1', () => {
      const spy = jest.spyOn((component as any)._router, 'navigateByUrl');
      component.isAudienceSaved = false;
      component.goBack();
      expect(spy).toBeCalledWith('/');
    });
    it('should not call router.navigateByUrl if audience is not saved', () => {
      const spy = jest.spyOn((component as any)._router, 'navigateByUrl');
      jest.spyOn((component as any)._location, 'getState').mockReturnValue({ navigationId: 2 });
      component.isAudienceSaved = false;
      component.goBack();
      expect(spy).not.toBeCalled();
    });

    it('should call _location.back if audience is not saved and navigationId is not 1', () => {
      const spy = jest.spyOn((component as any)._location, 'back');
      jest.spyOn((component as any)._location, 'getState').mockReturnValue({ navigationId: 2 });
      component.isAudienceSaved = false;
      component.goBack();
      expect(spy).toBeCalled();
    });
  });

  describe('toggleOverview', () => {
    it('should set isOverviewActive to input', () => {
      component.toggleOverview(true);
      expect(component.isOverviewActive).toBe(true);
    });
  });

  describe('subscribeToSaveAudience', () => {
    it('should call subscriptions add', () => {
      const spy = jest.spyOn((component as any).subscriptions, 'add');
      (component as any).subscribeToSaveAudience();
      expect(spy).toBeCalled();
    });

    it('should call saveAudience', fakeAsync(() => {
      const spy = jest.spyOn(component as any, 'saveAudience').mockReturnValue(of('test'));
      (component as any).subscribeToSaveAudience();
      component.saveAudience$.next(null);
      tick(300);
      expect(spy).toBeCalled();
    }));

    it('should call exportAudience$', fakeAsync(() => {
      const spy = jest.spyOn(component as any, 'exportAudience$').mockReturnValue(of('test'));
      (component as any).subscribeToSaveAudience();
      component.saveAudience$.next({} as any);
      tick(300);
      expect(spy).toBeCalled();
    }));

    it('should set isAudienceSaved to true', fakeAsync(() => {
      jest.spyOn(component as any, 'saveAudience').mockReturnValue(of(null));
      (component as any).subscribeToSaveAudience();
      component.saveAudience$.next(null);
      tick(300);
      expect(component.isAudienceSaved).toBe(true);
    }));

    it('should call loadingService.isSavingAudience.emit with false on error', fakeAsync(() => {
      jest.spyOn(component as any, 'saveAudience').mockReturnValue(throwError('test'));
      const spy = jest.spyOn(loadingService.isSavingAudience, 'emit');
      (component as any).subscribeToSaveAudience();
      component.saveAudience$.next(null);
      tick(300);
      expect(spy).toBeCalledWith(false);
    }));
  });

  describe('handleMergedAudienceFromRouteData', () => {
    it('should call handleMergedAudience with route.snapshot.data[0]', () => {
      const spy = jest.spyOn(component as any, 'handleMergedAudience').mockImplementation();
      activatedRoute.snapshot.data = ['test'];
      (component as any).handleMergedAudienceFromRouteData();
      expect(spy).toBeCalledWith('test');
    });
  });

  describe('handleMergedAudience', () => {
    it('should call setAudienceRules with input[0].spec ', () => {
      const spy = jest.spyOn(component as any, 'setAudienceRules').mockImplementation();
      const mockInput = [{ spec: 'test' }];
      (component as any).handleMergedAudience(mockInput);
      expect(spy).toBeCalledWith('test');
    });
    it('should call setUserTags with input ', () => {
      const spy = jest.spyOn(component as any, 'setUserTags').mockImplementation();
      const mockInput = 'test';
      (component as any).handleMergedAudience(mockInput);
      expect(spy).toBeCalledWith(mockInput);
    });
    it('should call setSelectTagsConfig', () => {
      jest.spyOn(component as any, 'setAudienceRules').mockImplementation();
      const spy = jest.spyOn(component as any, 'setSelectTagsConfig').mockImplementation();
      (component as any).handleMergedAudience([{ spec: 'test' }]);
      expect(spy).toBeCalled();
    });

    it('should work with empty []', () => {
      try {
        (component as any).handleMergedAudience([]);
      } catch (error) {
        expect(error).toBeNull();
      }
    });
  });

  describe('triggerSaveAudience', () => {
    it('should call next on saveAudience$', () => {
      const spy = jest.spyOn(component.saveAudience$, 'next');
      component.triggerSaveAudience();
      expect(spy).toBeCalled();
    });
  });

  describe('setAudienceRules', () => {
    it('should update rules with return value from createRulesFromTargeting', () => {
      (component as any).setAudienceRules(mockRegularTargeting);
      const expectedResult = createRulesFromTargeting(mockRegularTargeting);
      expect(component.rules).toEqual(expectedResult);
    });
  });

  describe('setUserTags', () => {
    it('should set audience form userTags field to merged userTags from audiences', () => {
      (component as any).setUserTags(mockSearchResultsForTags);
      const testTags = ['test 1', 'test 2', 'test 3', 'test 4'];
      expect(component.audienceForm.get('userTags').value).toEqual(testTags);
    });
  });

  describe('enableSaveOnValueChange', () => {
    it('should call suscriptions.add', () => {
      const spy = jest.spyOn((component as any).subscriptions, 'add');
      (component as any).enableSaveOnValueChange();
      expect(spy).toBeCalled();
    });

    it('should subscribe to audienceForm.valueChanges', () => {
      const spy = jest.spyOn(component.audienceForm.valueChanges, 'subscribe');
      (component as any).enableSaveOnValueChange();
      expect(spy).toBeCalled();
    });

    it('should set isAudienceSaved to false on value changed', () => {
      component.isAudienceSaved = true;
      component.audienceForm.setValue(audienceFormValuesMock);
      expect(component.isAudienceSaved).toBe(false);
    });
  });

  describe('setSelectTagsConfig', () => {
    it('should set selectTagsConfig', () => {
      (component as any).setSelectTagsConfig();
      const expectedSelectTagsConfig: SelectTagsConfig = { disabled: false, tagSuggestions: [] };
      expect(component.selectTagsConfig).toEqual(expectedSelectTagsConfig);
    });
  });

  describe('saveAudience', () => {
    it('should call audiencesService.resetSelectedAudiences', () => {
      jest.spyOn(component as any, 'getAudienceValues').mockImplementation();
      (component as any).saveAudience();
      expect(audiencesService.resetSelectedAudiences).toBeCalled();
    });

    it('should call audiencesService.setFoundAudiences.emit with null', () => {
      jest.spyOn(component as any, 'getAudienceValues').mockImplementation();
      (component as any).saveAudience();
      expect(audiencesService.setFoundAudiences.emit).toBeCalledWith(null);
    });

    it('should call audiencesService.saveAudience with return value from getAudienceValues', () => {
      jest.spyOn(component as any, 'getAudienceValues').mockImplementation(() => 'test');
      (component as any).saveAudience();
      expect(audiencesService.saveAudience).toBeCalledWith('test');
    });
  });

  describe('getAudienceValues', () => {
    it('should return data from form', () => {
      component.audienceForm.setValue(audienceFormValuesMock);
      component.audienceForm.get('name').setValue('test');
      component.audienceForm.get('target').setValue(mockRegularTargeting);
      component.audienceForm.get('userTags').setValue(['test 1, test 2']);
      const result = (component as any).getAudienceValues();
      (mockRegularTargeting as any).provider = [SupportedProviders.FACEBOOK];
      expect(result).toEqual({ name: 'test', targeting: mockRegularTargeting, userTags: ['test 1, test 2'] });
    });
  });

  describe('subscribeToChangeAdAccount', () => {
    it('should call subscriptions.add', () => {
      const spy = jest.spyOn((component as any).subscriptions, 'add');
      (component as any).subscribeToChangeAdAccount();
      expect(spy).toBeCalled();
    });

    it('should set audienceForm.adAccount with user adAccount from state if any exist', () => {
      store.reset({ user: { adAccounts: [{ id: 'test' }] } });
      const { value } = component.audienceForm.get('adAccount');
      expect(value).toEqual({ providerId: 'test' });
    });

    it('should do nothing if user state is null or has no ad accounts', () => {
      const getAdAccountControlValue = () => component.audienceForm.get('adAccount').value;
      expect(getAdAccountControlValue()).toBe('');
      store.reset({ user: { adAccounts: [] } });
      expect(getAdAccountControlValue()).toBe('');
    });
  });

  describe('exportAudience$', () => {
    it('should call export audience with argument value', (done) => {
      const spy = jest
        .spyOn(component as any, 'exportAudience')
        .mockReturnValue(of({ campaign: { providerId: 1, adAccountId: 'something' }, adSet: { providerId: 1 } }));
      (component as any).exportAudience$({ id: 'test' } as any).subscribe((res) => {
        expect(spy).toBeCalledWith({ id: 'test' });
        done();
      });
    });

    it('should call modalService.openOnOK', (done) => {
      jest
        .spyOn(component as any, 'exportAudience')
        .mockReturnValue(of({ campaign: { providerId: 1 }, adSet: { providerId: 1 } }));
      const spy = jest.spyOn(modalService, 'openOnOK');
      (component as any).exportAudience$({ id: 'test' } as any).subscribe((res) => {
        expect(spy).toBeCalled();
        done();
      });
    });
  });

  describe('exportAudience', () => {
    it('should call audiencesService.exportAudience and set isAudienceExported to true', (done) => {
      jest.spyOn(component as any, 'getAudienceValues').mockReturnValue({});
      const spy = jest.spyOn(audiencesService, 'exportAudience');
      (component as any).exportAudience().subscribe((res) => {
        expect(spy).toBeCalled();
        expect(component.isAudienceExported).toBe(true);
        done();
      });
    });
  });

  describe('triggerExportAudience', () => {
    it('should call to modalService.openAdAccountSelectorModal with rules', () => {
      const spy = jest.spyOn(modalService, 'openAdAccountSelectorModal');
      component.rules = 'test' as any;
      component.triggerExportAudience();
      expect(spy).toBeCalledWith('test');
    });

    it('should call next on saveAudience$ with return after close', () => {
      const spy = jest.spyOn(component.saveAudience$, 'next');
      component.rules = 'test rules' as any;
      component.triggerExportAudience();
      expect(spy).toBeCalledWith('test');
    });
  });
});
