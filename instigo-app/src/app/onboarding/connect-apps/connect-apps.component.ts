import { Component, OnInit } from '@angular/core';
import { UserState } from '@app/global/user.state';
import { AdAccountDTO, encodeState, SupportedProviders, User } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { environment } from 'src/environments/environment';
import { slideUp } from '../animations';
import { OnboardingService } from '../onboarding.service';
import { OnboardingState, OnboardingStateModel } from '../onboarding.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';

@Component({
  selector: 'app-connect-apps',
  templateUrl: './connect-apps.component.html',
  styleUrls: ['./connect-apps.component.scss'],
  animations: [slideUp],
})
export class ConnectAppsComponent implements OnInit {
  @SelectSnapshot(UserState.get) user: User;
  @SelectSnapshot(OnboardingState.get) onboarding: OnboardingStateModel;
  @Select(OnboardingState.getSelectedAccounts) getSelectedAccounts$: Observable<AdAccountDTO[]>;

  public isFacebookIntegration$;
  public isLinkedinIntegration$;
  public enableLinkedin: boolean;

  public socialLoginPaths = {
    facebookPath: null,
    linkedinPath: null,
  };

  constructor(private onboardingService: OnboardingService, private analytics: AnalyticsService) {
    this.enableLinkedin = environment.features.linkedin;
  }

  ngOnInit(): void {
    this.isFacebookIntegration$ = this.getSelectedAccounts$.pipe(
      filter((adAccounts) => adAccounts?.length > 0),
      map((adAccounts) => adAccounts?.some((adAccount) => adAccount.provider === SupportedProviders.FACEBOOK)),
    );
    this.isLinkedinIntegration$ = this.getSelectedAccounts$.pipe(
      filter((adAccounts) => adAccounts?.length > 0),
      map((adAccounts) => adAccounts?.some((adAccount) => adAccount.provider === SupportedProviders.LINKEDIN)),
    );

    const state = {
      user: this.user,
      scope: `authorizeApp`,
    };

    const facebookState = {
      ...state,
      redirect: `${environment.frontendUrl}/onboarding/select-ad-account/facebook`,
    };

    const linkedinState = {
      ...state,
      redirect: `${environment.frontendUrl}/onboarding/select-ad-account/linkedin`,
    };

    this.socialLoginPaths = {
      facebookPath: `server/auth/facebook/authorizeApp/login?state=${encodeState(facebookState)}`,
      linkedinPath: `server/auth/linkedin/authorizeApp/login?state=${encodeState(linkedinState)}`,
    };
  }

  public letsRoll() {
    this.analytics.sendEvent({
      event: 'Onboarding',
      action: 'step_completed',
      data: {
        event: 'Onboarding',
        step: '03_connect_accounts',
      },
    });
    return this.onboardingService.completeOnboarding();
  }
}
