import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkedinCampaignSettingsComponent } from './linkedin-campaign-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CampaignGroupsApiService } from '@app/api/services/campaign-groups.api.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CampaignGroupsSelectorModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/campaign-setttings/campaign-groups/campaign-groups-selector.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';

describe('LinkedinCampaignSettingsComponent', () => {
  let fixture: ComponentFixture<LinkedinCampaignSettingsComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedinCampaignSettingsComponent],
      imports: [
        TranslateModule.forRoot(),
        CommonModule,
        CampaignGroupsSelectorModule,
        ReactiveFormsModule,
        UiSharedModule,
        NzFormModule,
        NzCardModule,
        NzButtonModule,
        NzInputModule,
        NzDividerModule,
      ],
      providers: [{ provide: CampaignGroupsApiService, useValue: {} }],
    });

    fixture = TestBed.createComponent(LinkedinCampaignSettingsComponent);
  });

  it('should be defined', () => {
    expect(fixture.componentInstance).toBeDefined();
  });
});
