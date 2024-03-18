import { Component, Input } from '@angular/core';
import { SwitchWorkspace } from '@app/pages/state/workspace.state';
import { User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

@Component({
  selector: 'app-workspaces-dropdown-switcher',
  templateUrl: './workspaces-dropdown-switcher.component.html',
  styleUrls: ['./workspaces-dropdown-switcher.component.scss'],
})
export class WorkspacesDropdownSwitcherComponent {
  @Input()
  workspace: WorkspaceDTO;

  @Input()
  currentWorkspace: WorkspaceDTO;

  @Input()
  currentUser: User;

  @Dispatch()
  public selectedWorkspace(workspace: WorkspaceDTO): SwitchWorkspace {
    return new SwitchWorkspace(workspace);
  }
}
