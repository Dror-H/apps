import { Component } from '@angular/core';
import { AuthAction } from '@audience-app/auth/auth.models';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { LoadingState } from '@audience-app/store/loading.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  @Select(LoadingState.getIsLoadingAuth) public isLoadingAuth$: Observable<boolean>;
  public authAction: AuthAction = 'signin';

  constructor(private authService: AuthService, private modalService: ModalService) {}

  public closeModal(): void {
    this.modalService.closeModal();
  }

  public executeAuthAction(): void {
    if (this.authAction === 'signout') {
      return this.authService.logout();
    }
    return this.authService.login();
  }

  public authActionContent = {
    signin: {
      title: 'Sign In',
      description: 'You must be signed in to continue',
      actionText: 'Sign In With Facebook',
    },
    signout: {
      title: 'Sign Out',
      description: 'Are you sure you want to sign out?',
      actionText: 'Sign Out',
    },
  };
}
