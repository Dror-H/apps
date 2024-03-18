import { NgxStripeModule } from 'ngx-stripe';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdAccountSelectModule } from '@app/features/ad-account-select/ad-account-select.module';
import { GlobalModule } from '@app/global/global.module';
import { OnboardingState } from '@app/onboarding/onboarding.state';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { InlineSVGModule } from 'ng-inline-svg';
import { ClearStateService } from './clear-state.service';
import { ConnectAppsComponent } from './connect-apps/connect-apps.component';
import { CreateWorkspaceComponent } from './create-workspace/create-workspace.component';
import { DataVerificationComponent } from './data-verification/data-verification.component';
import { InvitedMemberDataVerificationComponent } from './invited-member-data-verification/invited-member-data-verification.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingService } from './onboarding.service';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { OnboardingPageGuard } from './onboardingPage.guard';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SelectAdAccountModule } from './select-ad-account/select-ad.account.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [
    DataVerificationComponent,
    OnboardingComponent,
    CreateWorkspaceComponent,
    ConnectAppsComponent,
    InvitedMemberDataVerificationComponent,
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    NzModalModule,
    NzDividerModule,
    TranslateModule,
    FormsModule,
    NgxsModule.forFeature([OnboardingState]),
    ReactiveFormsModule,
    GlobalModule,
    AdAccountSelectModule,
    InlineSVGModule.forRoot(),
    SelectAdAccountModule,
    NgbNavModule,
    NgxStripeModule.forRoot(environment.stripeKey),
  ],
  providers: [OnboardingPageGuard, OnboardingService, ClearStateService],
})
export class OnboardingModule {}
