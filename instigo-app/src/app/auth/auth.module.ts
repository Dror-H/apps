import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CustomFormsModule } from 'ngx-custom-validators';
import { GlobalModule } from '../global/global.module';
import { AlreadyLoggedInGuard } from './already-logged-in.guard';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { AuthComponent } from './components/auth.component';
import { ExpiredInvitationComponent } from './components/expired-invitation/expired-invitation.component';
import { LoginComponent } from './components/login/login.component';
import { OnboardingSliderComponent } from './components/onboarding-slider/onboarding-slider.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SendResetPasswordComponent } from './components/send-reset-password/send-reset-password.component';
import { SocialComponent } from './components/social/social.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    GlobalModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AuthRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    CustomFormsModule,
    NgbModule,
    NzLayoutModule,
    NzGridModule,
    NzFormModule,
    NzButtonModule,
    NzToolTipModule,
    InlineSVGModule.forRoot(),
  ],
  declarations: [
    AuthComponent,
    SocialComponent,
    LoginComponent,
    ResetPasswordComponent,
    SendResetPasswordComponent,
    RegisterComponent,
    OnboardingSliderComponent,
    ExpiredInvitationComponent,
  ],
  providers: [AuthService, AlreadyLoggedInGuard],
})
export class AuthModule {}
