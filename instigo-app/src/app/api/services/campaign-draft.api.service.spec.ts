import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CampaignDraftApiService } from '@app/api/services/campaign-draft.api.service';
import { Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';

const fb = new FormBuilder();
const campaignForm = fb.group({
  settings: fb.group({
    account: ['someAccount'],
    provider: [SupportedProviders.FACEBOOK],
    name: ['test campaign', [Validators.required]],
  }),
});

describe('CampaignDraftComponent', () => {
  let service: CampaignDraftApiService;
  let httpController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CampaignDraftApiService],
    });

    service = TestBed.inject(CampaignDraftApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should delete drafts', () => {
    const ids = { campaignDraftIds: ['adsfas', 'fasdfas'] };

    service.deleteMany(ids).subscribe((data) => {
      expect(data).toEqual('deleted');
    });
    const req = httpController.expectOne({
      method: 'DELETE',
      url: `server/${Resources.CAMPAIGN_DRAFTS}?campaignDraftIds=${ids.campaignDraftIds}`,
    });

    req.flush('deleted');
  });

  it('should update the draft', fakeAsync(() => {
    jest
      .spyOn(service, 'create')
      .mockImplementation((options) => of({ draftId: 'fasdfsa', provider: SupportedProviders.FACEBOOK }) as any);

    service.listenOnCampaignChangesAndSaveDraft(
      campaignForm,
      new BehaviorSubject({
        draftId: 'fasdfsa',
        provider: SupportedProviders.FACEBOOK,
      }),
    );

    campaignForm.get('settings.name').setValue('changed name');
    tick(1500);

    expect(campaignForm.value).toEqual({
      settings: {
        account: 'someAccount',
        name: 'changed name',
        provider: 'facebook',
      },
    });
  }));

  it('should not update the draft', fakeAsync(() => {
    service.listenOnCampaignChangesAndSaveDraft(
      campaignForm,
      new BehaviorSubject({
        draftId: 'fasdfsa',
        provider: SupportedProviders.FACEBOOK,
      }),
    );
    campaignForm.get('settings.name').setValue(null);
    tick(1500);

    expect(campaignForm.value).toEqual({
      settings: {
        account: 'someAccount',
        name: null,
        provider: 'facebook',
      },
    });
  }));
});
