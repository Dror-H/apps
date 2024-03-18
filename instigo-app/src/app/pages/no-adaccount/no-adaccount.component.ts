import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ingo-no-adaccount',
  templateUrl: './no-adaccount.component.html',
  styleUrls: ['./no-adaccount.component.scss'],
})
export class NoAdAccountComponentComponent {
  @Select(WorkspaceState.get) public workspace$: Observable<WorkspaceDTO>;

  constructor(private router: Router) {}

  public async redirectToWorkspace(): Promise<void> {
    this.workspace$
      .pipe(take(1))
      .subscribe((workspace) => this.router.navigate(['account-control/workspaces/details', workspace.id]));
  }
}
