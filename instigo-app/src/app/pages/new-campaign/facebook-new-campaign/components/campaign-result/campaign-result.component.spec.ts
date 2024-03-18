import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignResult, CampaignResultComponent } from './campaign-result.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CampaignStatusType,
  FacebookCampaignDraft,
  StepFailure,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';

const successResult: CampaignResult = {
  title: `Andy's campaign`,
  type: 'success',
  campaign: {
    settings: {
      name: 'test',
      buyingType: 'auction',
      objective: 'LINK_CLICKS',
      specialCats: false,
      specialCatsOptions: null,
      provider: SupportedProviders.FACEBOOK,
      status: CampaignStatusType.ACTIVE,
    },
  } as unknown as FacebookCampaignDraft,
};

const errorResult: CampaignResult = {
  title: `Andy's campaign`,
  type: 'error',
  campaign: {
    settings: {
      name: 'test',
      buyingType: 'auction',
      objective: 'LINK_CLICKS',
      specialCats: false,
      specialCatsOptions: null,
      provider: SupportedProviders.FACEBOOK,
      status: CampaignStatusType.ACTIVE,
    },
  } as unknown as FacebookCampaignDraft,
  error: {
    error: {
      error: {
        error: {
          stepFailure: StepFailure.CAMPAIGN,
          trace: {
            error: {
              errorUserTitle: 'whatever error title',
              errorUserMsg: 'whatever error msg',
            },
          },
        },
      },
    },
  } as unknown as FacebookCampaignDraft,
};

describe('CampaignResultComponent', () => {
  let fixture: ComponentFixture<CampaignResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignResultComponent],
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        NzResultModule,
        NzTypographyModule,
        NzIconModule,
        NzButtonModule,
        NzCardModule,
      ],
    });

    fixture = TestBed.createComponent(CampaignResultComponent);
  });

  it('should be defined for success', () => {
    const successResultComponent = fixture.componentInstance;
    successResultComponent.result = successResult;
    fixture.detectChanges();
    expect(successResultComponent).toBeDefined();
  });

  it('should be defined for error', () => {
    const errorResultComponent = fixture.componentInstance;
    errorResultComponent.result = errorResult;
    fixture.detectChanges();
    expect(errorResultComponent).toBeDefined();
  });
});
