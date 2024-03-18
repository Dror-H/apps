import { Component, OnInit } from '@angular/core';
import { UserState } from '@app/global/user.state';
import { SwitchWorkspace, WorkspaceState } from '@app/pages/state/workspace.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

@Component({
  selector: 'ingo-workspace-switcher',
  template: `
    <a *ngFor="let workspace of assignedWorkspaces$ | async" (click)="selectWorkspace(workspace)">
      <nz-card style="width:300px;">
        <p>{{ workspace.name }}</p>
      </nz-card>
    </a>
  `,
})
export class WorkspaceSwitcherComponent {
  @Select(UserState.assignedWorkspaces)
  assignedWorkspaces$: Observable<WorkspaceDTO[]>;

  @Select(WorkspaceState.get)
  currentWorkspace$: Observable<WorkspaceDTO>;

  @Dispatch()
  selectWorkspace(workspace: WorkspaceDTO) {
    return new SwitchWorkspace(workspace);
  }
}
