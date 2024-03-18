import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SavedAudienceSelectorComponent } from '@app/pages/new-campaign/facebook-new-campaign/components/targeting-settings/define-audience/load-saved-audience/saved-audience-selector/saved-audience-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { AdAccountDTO, SupportedProviders, TargetingTemplateDto } from '@instigo-app/data-transfer-object';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AudienceApiService } from '@app/api/services/audience.api.service';

const selectedAudienceMock = {
  audienceType: 'Saved Audience',
  audienceSubType: null,
  provider: 'facebook',
  description: null,
  name: 'Already existing saved audience',
  reach: {
    count: 10400000,
    estimateReady: true,
  },
  target: {
    exclude: {
      or: {
        customAudiences: [],
      },
    },
    include: {
      and: [
        {
          or: {
            countries: [
              {
                name: 'Romania',
                type: 'countries',
                included: true,
                providerId: 'RO',
                countryCode: 'RO',
                countryName: 'Romania',
                audienceSize: null,
                providerType: 'adgeolocation',
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'country',
              },
            ],
            locationTypes: [
              {
                providerId: 'home',
              },
              {
                providerId: 'recent',
              },
            ],
          },
        },
        {
          or: {
            ageRange: [
              {
                providerId: '(18,65)',
              },
            ],
          },
        },
        {
          or: {
            locales: [
              {
                providerId: null,
              },
            ],
          },
        },
        {
          or: {
            genders: [
              {
                providerId: ['0'],
              },
            ],
          },
        },
        {
          or: {
            targetingOptimization: [
              {
                providerId: false,
              },
            ],
          },
        },
        {
          or: {
            customAudiences: [],
          },
        },
        {
          or: {
            facebookConnections: [],
          },
        },
      ],
    },
  },
  isCampaignCreation: true,
  id: 'd97e6433-362c-453b-84fc-0d0e4db54aad',
} as unknown as TargetingTemplateDto;

const expectedSources = [
  {
    id: 'adsfadsaffsd',
    name: 'akldfhj;alksdjf',
  },
  {
    id: 'adsffasdfasd',
    name: 'test sfwkelfjnclkasdomething',
  },
  {
    id: 'adsffassdsadfasd',
    name: 'test ',
  },
  {
    id: 'adsffassdsadfasd',
    name: 'dfa ',
  },
  {
    id: 'asdfuhijsla',
    name: 'Already existing saved audience',
  },
];

const expectedDefaultSources = [
  {
    id: 'adsfadsaffsd',
    name: 'akldfhj;alksdjf',
  },
  {
    id: 'adsffasdfasd',
    name: 'test sfwkelfjnclkasdomething',
  },
  {
    id: 'adsffassdsadfasd',
    name: 'test ',
  },
  {
    id: 'adsffassdsadfasd',
    name: 'dfa ',
  },
  {
    id: 'asdfuhijsla',
    name: 'Already existing saved audience',
  },
];

describe('SavedAudienceSelectorComponent', () => {
  let component: SavedAudienceSelectorComponent;
  let fixture: ComponentFixture<SavedAudienceSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedAudienceSelectorComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NzSelectModule,
        NzButtonModule,
        NzIconModule,
        NzGridModule,
      ],
      providers: [
        {
          provide: AudienceApiService,
          useValue: {
            findAll: () => of(''),
          },
        },
        {
          provide: TargetingApiService,
          useValue: {
            findAll: (query: string) => {
              if (
                query ===
                'filter%5B0%5D=provider%7C%7C%24eq%7C%7Cfacebook&filter%5B1%5D=adAccount.id%7C%7C%24eq%7C%7Cfasdfasd&cache=0&limit=10&offset=10&sort%5B0%5D=name%2CASC'
              ) {
                return of({
                  total: 2,
                  data: [
                    { name: 'Test something', id: 'adsfasd' },
                    { name: 'test something', id: 'adsffasdasd' },
                  ],
                });
              }
              if (
                query ===
                'filter%5B0%5D=provider%7C%7C%24eq%7C%7Cfacebook&filter%5B1%5D=adAccount.id%7C%7C%24eq%7C%7Cfasdfasd&filter%5B2%5D=name%7C%7C%24contL%7C%7CAlready%20existing%20saved%20audience&cache=0&limit=10&offset=0&sort%5B0%5D=name%2CASC'
              ) {
                return of({
                  total: 1,
                  data: [{ name: 'Already existing saved audience', id: 'asdfuhijsla' }],
                });
              }
              return of({
                total: 2,
                data: [
                  { name: 'akldfhj;alksdjf', id: 'adsfadsaffsd' },
                  { name: 'test sfwkelfjnclkasdomething', id: 'adsffasdfasd' },
                  { name: 'test ', id: 'adsffassdsadfasd' },
                  { name: 'dfa ', id: 'adsffassdsadfasd' },
                ],
              });
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(SavedAudienceSelectorComponent);
    component = fixture.componentInstance;

    component.adAccount = {
      id: 'fasdfasd',
      providerId: 'fadsfads',
      provider: SupportedProviders.FACEBOOK,
    } as unknown as AdAccountDTO;

    component.selectedAudience = selectedAudienceMock;
    component.targeting = true;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should fetch the first time', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);

    expect(component.sources).toEqual([
      {
        name: 'Already existing saved audience',
        id: 'asdfuhijsla',
      },
    ]);
  }));

  it('should init', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);

    expect(component.sources).toEqual([
      {
        id: 'asdfuhijsla',
        name: 'Already existing saved audience',
      },
    ]);
  }));

  it('should change sources', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.onSearch('test');
    tick(1000);

    expect(component.sources).toEqual(expectedSources);
  }));

  it('should change clicking', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    (component as any).searchTerm = 'test';
    component.onSelectorOpened();
    tick(1000);

    expect(component.sources).toEqual(expectedSources);
  }));

  it('should not init', fakeAsync(() => {
    component.selectedAudience.id = null;
    component.ngOnInit();
    tick(1000);

    expect(component.sources).toEqual([]);
  }));

  it('should change by loading more sources', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.loadMoreCustomAudiences();
    tick(1000);

    expect(component.sources).toEqual([
      {
        id: 'adsfasd',
        name: 'Test something',
      },
      {
        id: 'adsffasdasd',
        name: 'test something',
      },
    ]);
  }));
});
