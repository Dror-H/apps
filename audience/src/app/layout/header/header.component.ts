import { Component, OnInit } from '@angular/core';
import { AuthAction } from '@audience-app/auth/auth.models';
import { User } from '@audience-app/global/models/app.models';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { UserState } from '@audience-app/store/user.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Select(UserState.getUserAndAdAccounts) userState$: Observable<User | null>;

  public isLoading$: Observable<boolean>;

  constructor(private modal: ModalService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading$ = this.authService.isLoading$;
  }

  public openAuthModal(type: AuthAction): void {
    this.modal.openAuthModal(type);
  }

  public signInWithFacebook(): void {
    this.authService.login();
  }
}
