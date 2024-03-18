import { Component, OnInit } from '@angular/core';
import { UserApiService } from '@app/api/services/user.api.service';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { UserState } from '@app/global/user.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ingo-workspace-dropdown',
  templateUrl: './workspaces-dropdown.component.html',
})
export class WorkspacesDropdownComponent implements OnInit {
  @Select(UserState.get)
  getUser$: Observable<User>;

  @Emitter(UserState.set)
  setUser: Emittable<string>;

  @Select(WorkspaceState.get)
  currentWorkspace$: Observable<WorkspaceDTO>;

  @Emitter(WorkspaceState.set)
  setWorkspace: Emittable<WorkspaceDTO>;

  public assignedWorkspaces: Observable<WorkspaceDTO[]>;

  constructor(public userApiService: UserApiService, public workspaceApiService: WorkspaceApiService) {}

  ngOnInit(): void {
    this.assignedWorkspaces = this.getUser$.pipe(map((user) => user.assignedWorkspaces));
  }
}
