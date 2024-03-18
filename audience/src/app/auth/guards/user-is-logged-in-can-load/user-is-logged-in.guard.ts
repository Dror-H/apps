import { Injectable } from '@angular/core';
import { CanLoad, DefaultUrlSerializer, Route, UrlSegment, UrlTree } from '@angular/router';
import { User } from '@audience-app/global/models/app.models';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { UserState } from '@audience-app/store/user.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserIsLoggedInGuard implements CanLoad {
  @SelectSnapshot(UserState) user: User;

  public constructor(private modalService: ModalService) {}

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.user) {
      const homeUrlTree = new DefaultUrlSerializer().parse('');
      return this.modalService.openAuthModal('signin').afterClose.pipe(map(() => homeUrlTree));
    }

    return true;
  }
}
