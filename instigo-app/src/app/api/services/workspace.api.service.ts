import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resources, User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CrudService } from '../crud.service';

@Injectable()
export class WorkspaceApiService extends CrudService<WorkspaceDTO, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.WORKSPACES);
  }

  onboard({ payload }) {
    return this.httpClient.post(`server/${Resources.WORKSPACES}/onboard`, payload);
  }

  dashboard(query?): any {
    return this.httpClient.get(`server/${Resources.WORKSPACES}-dashboard${query}`).pipe(take(1));
  }

  syncWorkspaceData({ workspaceId }) {
    return this.httpClient
      .put(`server/${Resources.WORKSPACES}/${workspaceId}/sync`, {}, { headers: { 'current-workspace': workspaceId } })
      .pipe(take(1));
  }

  inviteUserToWorkspace(options: { email: string; workspaceId: string }): Observable<Partial<User>> {
    const { email, workspaceId } = options;
    return this.httpClient
      .post(
        `server/workspace-invite/${workspaceId}/invite`,
        { email },
        { headers: { 'current-workspace': workspaceId } },
      )
      .pipe(take(1));
  }

  disable({ workspaceId }): Observable<Partial<WorkspaceDTO>> {
    return this.httpClient
      .post(
        `server/${Resources.WORKSPACES}/${workspaceId}/disable`,
        {},
        { headers: { 'current-workspace': workspaceId } },
      )
      .pipe(take(1));
  }

  leave({ workspaceId }): Observable<Partial<WorkspaceDTO>> {
    return this.httpClient
      .post(
        `server/${Resources.WORKSPACES}/${workspaceId}/leave`,
        {},
        { headers: { 'current-workspace': workspaceId } },
      )
      .pipe(take(1));
  }
}
