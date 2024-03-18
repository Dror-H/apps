import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LogoutService } from '@app/global/logout.service';
import { UserState } from '@app/global/user.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { User } from '@instigo-app/data-transfer-object';
import { Select } from '@ngxs/store';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { CreatePopoverItems } from './create-items';
import { UserbackService } from '@app/shared/analytics/userback.service';

@Component({
  selector: 'ingo-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input()
  isCollapsed: boolean;

  @Input()
  headerColorScheme: string;

  @Output()
  menuCollapsed = new EventEmitter();

  @Select(UserState.get)
  user$: Observable<User>;

  @Select(WorkspaceState.isWorkspaceOwner)
  isWorkspaceOwner$: Observable<boolean>;

  public config: PerfectScrollbarConfigInterface = {};
  public createPopover: any[];

  constructor(private readonly logoutService: LogoutService, private userback: UserbackService) {}

  ngOnInit(): void {
    this.createPopover = CreatePopoverItems.filter((createPopoverItem) => createPopoverItem);
  }

  public logout() {
    this.logoutService.logout();
  }

  public openFeedbackTool(): void {
    this.userback.triggerModal();
  }
}
