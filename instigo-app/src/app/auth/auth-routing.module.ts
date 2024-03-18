import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetJwtService } from '@app/security/setJwt.service';
import { AlreadyLoggedInGuard } from './already-logged-in.guard';
import { AuthComponent } from './components/auth.component';
import { ExpiredInvitationComponent } from './components/expired-invitation/expired-invitation.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SendResetPasswordComponent } from './components/send-reset-password/send-reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [AlreadyLoggedInGuard],
    children: [
      { path: 'login', component: LoginComponent, data: { state: 'page1', title: 'Login' } },
      { path: 'register', component: RegisterComponent, data: { state: 'page2', title: 'Register' } },
      { path: 'send-reset-password', component: SendResetPasswordComponent, data: { title: 'Reset Password' } },
      {
        path: 'reset-password/:token',
        canActivate: [SetJwtService],
        component: ResetPasswordComponent,
        data: { title: 'Reset Password' },
      },
      { path: 'expired-invitation', component: ExpiredInvitationComponent, data: { title: 'Invitation Expired' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
