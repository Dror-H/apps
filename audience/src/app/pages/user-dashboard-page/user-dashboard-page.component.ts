import { Component, OnInit } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { controlCardListItems } from '@audience-app/pages/user-dashboard-page/control-card-data';
import { UserState } from '@audience-app/store/user.state';
import { UserDashboardControlCardUserInfo, UserDashboardControlListItem } from '@instigo-app/ui/shared';
import { Select } from '@ngxs/store';
import { format } from 'date-fns';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-user-dashboard-page',
  templateUrl: './user-dashboard-page.component.html',
  styleUrls: ['./user-dashboard-page.component.scss'],
})
export class UserDashboardPageComponent implements OnInit {
  @Select(UserState.getUserAndAdAccounts) user$: Observable<User>;

  public user: UserDashboardControlCardUserInfo;
  public listItems: UserDashboardControlListItem[] = controlCardListItems;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscribeToUser();
  }

  public logout(): void {
    this.authService.logout();
  }

  private subscribeToUser(): void {
    this.user$.subscribe((user) => {
      const lastLogin = format(new Date(user.lastLogin), 'dd/MM/yyyy');
      const memberSince = format(new Date(user.createdAt), 'dd/MM/yyyy ');
      this.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        pictureUrl: user.profilePicture,
        lastLogin,
        memberSince,
      };
    });
  }
}
