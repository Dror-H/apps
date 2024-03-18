import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NewCampaignLayoutComponent } from '@app/pages/new-campaign/new-campaign-layout.component';
import { NewCampaignLayoutService } from '@app/pages/new-campaign/new-campaign-layout.service';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { TranslateModule } from '@ngx-translate/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CampaignResultModule } from './facebook-new-campaign/components/campaign-result/campaign-result.module';

@Component({
  template: '',
})
class FacebookNewCampaignMockComponent {}

@Component({
  template: '',
})
class LinkedinNewCampaignMockComponent {}

export const routes: Routes = [
  { path: '', redirectTo: 'new-campaign', pathMatch: 'prefix' },
  {
    path: 'new-campaign',
    component: NewCampaignLayoutComponent,
    children: [
      { path: 'linkedin', component: LinkedinNewCampaignMockComponent },
      { path: 'facebook', component: FacebookNewCampaignMockComponent },
    ],
  },
];

describe('New Campaign Layout Component', () => {
  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<NewCampaignLayoutComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCampaignLayoutComponent, FacebookNewCampaignMockComponent, LinkedinNewCampaignMockComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        NzBadgeModule,
        NzToolTipModule,
        CommonModule,
        UiSharedModule,
        CampaignResultModule,
        TranslateModule.forRoot(),
        NzButtonModule,
        NzFormModule,
        NzPageHeaderModule,
        NzCardModule,
      ],
      providers: [NewCampaignLayoutService],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(NewCampaignLayoutComponent);

    router.initialNavigation();
  });

  it('should initialize', () => {
    const layoutComponent = fixture.componentInstance;
    expect(layoutComponent).toBeDefined();
  });

  it('should auto redirect to /new-campaign', () => {
    expect(location.path()).toBe('/new-campaign');
  });

  it('should redirect to /new-campaign/facebook when facebook button is pressed', waitForAsync(() => {
    fixture.detectChanges();
    const facebookTypeButton = fixture.debugElement.nativeElement.querySelector(
      '[test-id="new-campaign-type-facebook"]',
    );
    facebookTypeButton.click();

    void fixture.whenStable().then(() => {
      expect(location.path()).toBe('/new-campaign/facebook');
    });
  }));

  it('should redirect to /new-campaign/linkedin when linkedin button is pressed', waitForAsync(() => {
    fixture.detectChanges();
    const facebookTypeButton = fixture.debugElement.nativeElement.querySelector(
      '[test-id="new-campaign-type-linkedin"]',
    );
    facebookTypeButton.click();
    void fixture.whenStable().then(() => {
      expect(location.path()).toBe('/new-campaign/linkedin');
    });
  }));

  it('should start over', waitForAsync(() => {
    fixture.detectChanges();
    const layoutComponent = fixture.componentInstance;
    router.navigate['new-campaign/facebook'];

    void fixture.whenStable().then(() => {
      layoutComponent.startOver();

      void fixture.whenStable().then(() => {
        expect(location.path()).toBe('/new-campaign');
      });
    });
  }));

  it('should retry', () => {
    const layoutComponent = fixture.componentInstance;
    layoutComponent.layoutService.loadingOnCampaignCreate$.next(true);
    fixture.detectChanges();

    layoutComponent.retry();
    expect(layoutComponent.layoutService.loadingOnCampaignCreate$.value).toBeFalsy();
  });
});
