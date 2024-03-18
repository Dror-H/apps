import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthGuard } from './auth.guard';
import { AuthState } from './auth.state';
import { JWTInterceptorService } from './jwt.interceptor';
import { NoWorkspaceGuard } from './no-workspace.guard';
import { OnboardingGuard } from './onboarding.guard';
import { RedirectService } from './redirect.service';
import { SetJwtService } from './setJwt.service';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AuthState])],
  exports: [],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptorService,
      multi: true,
    },
    NoWorkspaceGuard,
    OnboardingGuard,
    SetJwtService,
    RedirectService,
  ],
})
export class SecurityModule {}
