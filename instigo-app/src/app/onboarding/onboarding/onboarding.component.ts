import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogoutService } from '@app/global/logout.service';
import { UserState } from '@app/global/user.state';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { User } from '@instigo-app/data-transfer-object';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { OnboardingService } from '../onboarding.service';
import { OnboardingState } from '../onboarding.state';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit, OnDestroy {
  @ViewChild(NgbNav)
  public onboardingNav: NgbNav;
  @ViewSelectSnapshot(OnboardingState.step)
  public activeStep: number;
  public isInvitedMember: boolean;
  public laststepchecked$: Observable<boolean>;

  @Select(UserState.get)
  private user$: Observable<User>;
  private subscriptions = new SubSink();
  private currentRoute: string;

  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly router: ActivatedRoute,
    private readonly logoutService: LogoutService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.snapshot.routeConfig.path;
    this.isInvitedMember = this.isInvitedMemberRoute();
    this.subscriptions.sink = this.onboardingService.getUserData().subscribe((user: User) => {
      this.onboardingService.updateUser.emit(user);
    });
    this.laststepchecked$ = this.onboardingService.getOnboarding$.pipe(
      map((onboarding) => onboarding.selectedAdAccounts?.length > 0),
    );
  }

  isInvitedMemberRoute() {
    return this.currentRoute.includes('invited-member');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  abortOnboarding() {
    this.analytics.sendEvent({
      event: 'Onboarding',
      action: 'onboarding_aborted',
      data: {
        event: 'Onboarding',
        step: this.activeStep,
      },
    });
    this.logoutService.logout();
  }
}
