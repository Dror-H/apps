import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SwitchWorkspace } from '@app/pages/state/workspace.state';
import { WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { format } from 'date-fns';

@Component({
  selector: 'ingo-account-workspace-card',
  templateUrl: './workspace-card.component.html',
  styleUrls: ['../workspace-list/workspace-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceCardComponent {
  @Input()
  workspace: WorkspaceDTO;

  @Input()
  currentWorkspace: WorkspaceDTO;

  constructor(private router: Router) {}

  get isCurrentWorkspace(): boolean {
    return this.workspace.id === this.currentWorkspace.id;
  }

  get workspaceInitials(): string {
    const wsName = this.workspace.name.split(' ');
    return (
      wsName?.length > 1 ? wsName.shift().charAt(0) + wsName.pop().charAt(0) : this.workspace.name.charAt(0)
    ).toUpperCase();
  }

  get isWorkspaceActive(): string {
    return this.workspace.disabled ? 'Inactive' : 'Active';
  }

  get adAccountsLimit(): number {
    return Math.floor((this.workspace.adAccounts?.length / 15) * 100);
  }

  get workspaceDates(): { created; updated } {
    return {
      created: format(new Date(this.workspace.createdAt), 'dd/MM/yyyy'),
      updated: format(new Date(this.workspace.updatedAt), 'dd/MM/yyyy'),
    };
  }

  public selectWorkspace(workspace) {
    void this.router.navigate(['/account-control/workspaces/details', workspace.id]);
  }

  @Dispatch()
  public selectedWorkspace(workspace: WorkspaceDTO) {
    return new SwitchWorkspace(workspace);
  }
}
