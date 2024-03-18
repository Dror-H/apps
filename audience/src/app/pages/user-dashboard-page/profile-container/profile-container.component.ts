import { Component } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';
import { UserState } from '@audience-app/store/user.state';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
})
export class ProfileContainerComponent {
  @Select(UserState.getUserAndAdAccounts) user$: Observable<User>;
  @Emitter(UserState.updateUserAndAdAccounts) public updateUser: Emittable<User>;

  public emitUpdateUser(user: User): void {
    this.updateUser.emit(user);
  }
}
