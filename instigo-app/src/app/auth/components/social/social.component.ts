import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { encodeState } from '@instigo-app/data-transfer-object';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';

@Component({
  selector: 'app-social-login',
  template: `
    <div class="row social-form">
      <div class="col-12">
        <a
          role="button"
          (click)="navigate('facebook', actionType)"
          class="btn btn-block btn-square shadow-sm  btn-facebook"
        >
          <i class="ng-fa-icon fab fa-facebook-f fa-lg"></i>&nbsp;{{ actionType }} with Facebook
        </a>
      </div>
      <div class="col-12">
        <a
          role="button"
          (click)="navigate('google', actionType)"
          class="btn btn-block btn-square shadow-sm  btn-facebook"
        >
          <i class="ng-fa-icon fab fa-google fa-lg"></i>&nbsp;{{ actionType }} with Google
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent {
  @Input() actionType: string;
  state = {
    user: null,
    scope: `login`,
  };
  socialLoginPaths = {
    facebook: `server/auth/facebook/social/login?state=${encodeState(this.state)}`,
    google: `server/auth/google/social/login?state=${encodeState(this.state)}`,
  };

  constructor(
    readonly authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    private analytics: AnalyticsService,
  ) {}

  navigate(provider: string, actionType: string) {
    const type = actionType !== 'Sign up' ? 'login' : 'signup';
    this.analytics.sendEvent({
      event: 'Auth',
      action: `${provider}-${type}`,
      data: { event: 'Auth' },
    });
    this.authService.loadingSpinner({ show: true });
    this.document.location.href = `${this.socialLoginPaths[provider]}`;
    this.authService.loadingSpinner({ show: false });
  }
}
