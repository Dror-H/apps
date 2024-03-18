import { Component, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { ActionBoxClickEvents } from '@audience-app/shared/components/action-box/action-box.models';
import { ActionButtonConfig } from '@audience-app/shared/components/action-buttons/action-buttons.models';
import { NgxsModule } from '@ngxs/store';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AudienceSearchPageComponent } from './audience-search-page.component';

@Component({ template: `<div></div>`, selector: 'audi-audience-search-input' })
export class AudienceSearchInputMockComponent {}

@Component({ template: `<div></div>`, selector: 'audi-custom-ratio-container' })
export class CustomRatioContainerMockComponent {}

@Component({ template: `<div></div>`, selector: 'audi-action-buttons' })
export class ActionButtonsMockComponent {
  @Input() public actionButtons: ActionButtonConfig<string>[];
  @Output() public clickEvent = new EventEmitter<string>();
}

@Component({ template: `<div></div>`, selector: 'audi-audience-cards-container' })
export class AudienceCardsContainerMockComponent {}

@Component({ template: `<div></div>`, selector: 'audi-action-box' })
export class ActionBoxMockComponent {
  @Output() public clickEvent = new EventEmitter<ActionBoxClickEvents>();
  @Input() public disabled: boolean;
  @Input() public loading: boolean;
}

@Component({
  selector: 'audi-details-drawer',
  template: `<div></div>`,
})
export class AudienceDetailsDrawerComponent {}

@Component({
  selector: 'audi-no-found-audiences',
  template: `<div></div>`,
})
export class MockNoFoundAudiencesComponent {}

@Pipe({ name: 'startCase' })
export class MockStartCasePipe implements PipeTransform {
  transform(text: string): string {
    return text;
  }
}

const mockComponents = [
  AudienceSearchInputMockComponent,
  CustomRatioContainerMockComponent,
  ActionButtonsMockComponent,
  ActionBoxMockComponent,
  AudienceCardsContainerMockComponent,
  AudienceDetailsDrawerComponent,
  MockNoFoundAudiencesComponent,
];

const mockAudienceService = {
  setSelectedAudiences: { emit: jest.fn() },
  resetSelectedAudiences: jest.fn(),
  resetFoundAudiences: jest.fn(),
  isLoadingAudiences: { emit: jest.fn() },
};
const mockRouter = { navigateByUrl: jest.fn() };

describe('AudienceSearchPageComponent', () => {
  let component: AudienceSearchPageComponent;
  let fixture: ComponentFixture<AudienceSearchPageComponent>;
  let audiencesService: AudiencesService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceSearchPageComponent, ...mockComponents, MockStartCasePipe],
      imports: [NgxsModule.forRoot([]), NzAffixModule, NzTypographyModule, NzGridModule, NzButtonModule],
      providers: [
        { provide: AudiencesService, useValue: mockAudienceService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fixture = TestBed.createComponent(AudienceSearchPageComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    audiencesService = fixture.debugElement.injector.get(AudiencesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onActionBoxClickEvent', () => {
    it('should call audiencesService.setSelectedAudiences.emit() with []', () => {
      component.onActionBoxClickEvent('clear');
      const spy = jest.spyOn(audiencesService.setSelectedAudiences, 'emit');
      expect(spy).toBeCalledWith([]);
    });

    it('should call router.navigateByUrl with "audience-edit" ', fakeAsync(() => {
      component.onActionBoxClickEvent('next');
      const spy = jest.spyOn(router, 'navigateByUrl');
      tick();
      expect(spy).toBeCalledWith('audience-edit');
    }));

    it('should throw action box ev type not supported error', () => {
      let errorRef: any;
      try {
        component.onActionBoxClickEvent('test' as 'next');
      } catch (error) {
        errorRef = error;
      }
      expect(errorRef).toBeDefined();
    });
  });

  describe('onActionButtonClickEvent', () => {
    it('should do nothing', () => {
      let errorRef: any;
      try {
        component.onActionButtonClickEvent('SEE_RECOMMENDED');
      } catch (error) {
        errorRef = error;
      }
      expect(router.navigateByUrl).not.toBeCalled();
      expect(errorRef).toBeUndefined();
    });

    it('should navigate to audience edit on LOAD_SAVED_AUDIENCES', () => {
      component.onActionButtonClickEvent('LOAD_SAVED_AUDIENCES');
      const spy = jest.spyOn(router, 'navigateByUrl');
      expect(spy).toBeCalledWith('audience-edit');
    });
    it('should navigate to audience edit on CREATE_NEW_AUDIENCE', () => {
      component.onActionButtonClickEvent('CREATE_NEW_AUDIENCE');
      const spy = jest.spyOn(router, 'navigateByUrl');
      expect(spy).toBeCalledWith('audience-edit');
    });

    it('should throw Action button event type not supported', () => {
      let errorRef: any;
      try {
        component.onActionButtonClickEvent('test' as 'SEE_RECOMMENDED');
      } catch (error) {
        errorRef = error;
      }
      expect(errorRef).toBeDefined();
    });
  });
});
