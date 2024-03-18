import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { SwitchWorkspace } from '@app/pages/state/workspace.state';
import { WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-workspace-details',
  templateUrl: './workspace-details.component.html',
  styleUrls: ['./workspace-details.component.scss'],
})
export class WorkspaceDetailsComponent implements OnInit, OnDestroy {
  public workspace: WorkspaceDTO;
  public loading$ = new BehaviorSubject<boolean>(true);
  private subsink = new SubSink();

  constructor(private route: ActivatedRoute, private workspaceApiService: WorkspaceApiService) {}

  ngOnInit() {
    this.subsink.sink = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('workspaceId');
          return this.workspaceApiService.findOne({ id });
        }),
        tap((workspace) => {
          this.loading$.next(false);
        }),
      )
      .subscribe((workspace) => (this.workspace = workspace));
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  public workspaceUpdated(workspace) {
    this.workspace = { ...workspace };
    this.selectWorkspace(this.workspace);
  }

  @Dispatch()
  private selectWorkspace(workspace: WorkspaceDTO) {
    return new SwitchWorkspace(workspace);
  }
}
