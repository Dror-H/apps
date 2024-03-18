import { Component } from '@angular/core';
import { UserState } from '@app/global/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  @SelectSnapshot(UserState.get)
  public user: User;

  @Emitter(UserState.update)
  private updateUser: Emittable<User>;

  public emitUpdateUser(user: User): void {
    this.updateUser.emit(user);
  }
}
