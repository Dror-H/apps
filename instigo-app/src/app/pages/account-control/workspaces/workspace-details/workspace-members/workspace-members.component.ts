import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { MemberStatus } from '@app/global/constants';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { UserState } from '@app/global/user.state';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { DataTableComponent } from '@app/shared/data-table/data-table/data-table.component';
import { User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { remove } from 'lodash-es';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-workspace-members',
  templateUrl: './workspace-members.component.html',
  styleUrls: ['./workspace-members.component.scss'],
})
export class WorkspaceMembersComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableComponent, { static: true }) dataTableComponent: DataTableComponent;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  dataTableTemplates: DataTableTemplatesComponent;

  @ViewChild('userStatusCellTemplate', { static: true })
  userStatusCellTemplate: TemplateRef<any>;

  @ViewChild('userRoleCellTemplate', { static: true })
  userRoleCellTemplate: TemplateRef<any>;

  @ViewChild('removeUserTemplate', { static: true })
  removeUserTemplate: TemplateRef<any>;

  @Input() workspace: WorkspaceDTO;

  public tableConfiguration: TableConfiguration;
  public tableData: Array<any>;
  public tableState = new TableState({ limit: 5 });
  public isSearchOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isAddMemberOpen: boolean = false;
  public isConfirmLoading: boolean = false;
  public newMemberEmail: string = '';
  public searchTerm$ = new Subject<string>();

  @Select(UserState.get)
  private getUser$: Observable<User>;

  private subscription = new SubSink();

  constructor(
    public workspaceApiService: WorkspaceApiService,
    private modalService: NgbModal,
    private displayNotificationService: DisplayNotification,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.updateTableState();
    this.subscription.sink = this.getUser$.subscribe((user) => {
      if (user.id !== this.workspace.owner.id) {
        this.tableConfiguration.selectable = false;
        this.tableConfiguration.customActions = [];
      }
    });
    this.subscription.sink = this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => {
          if (this.dataTableComponent) this.dataTableComponent?.onSearch(term);
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public toggleSearch() {
    this.isSearchOpen$.next(!this.isSearchOpen$.value);
  }

  public handleOk(): void {
    this.isConfirmLoading = true;
    this.addMemberToWorkspace({ workspace: this.workspace, email: this.newMemberEmail }).subscribe(
      (user) => {
        this.analytics.sendEvent({
          event: 'Workspace',
          action: 'member_add_success',
          data: { event: 'Workspace', email: user.email },
        });
        this.isAddMemberOpen = false;
        this.isConfirmLoading = false;
        this.workspace.inPendingMembers.push(user);
        this.displayNotification(user);
        this.updateTableState();
      },
      (error) => {
        this.analytics.sendEvent({
          event: 'Workspace',
          action: 'member_add_error',
          data: { event: 'Workspace', error: error.status },
        });
        this.isAddMemberOpen = false;
        this.isConfirmLoading = false;
        this.displayNotificationService.displayNotification(
          new Notification({
            content: error?.error?.message || error,
            type: NotificationType.ERROR,
          }),
        );
      },
    );
  }

  public handleCancel(): void {
    this.analytics.sendEvent({
      event: 'Workspace',
      action: 'member_add_cancel',
      data: { event: 'Workspace' },
    });
    this.isAddMemberOpen = false;
  }

  public openAddMemberModal(): void {
    this.isAddMemberOpen = true;
    this.analytics.sendEvent({
      event: 'Workspace',
      action: 'member_add_start',
      data: { event: 'Workspace' },
    });
  }

  removeFromWorkspaceUser(selectedMember: User): void {
    try {
      if (selectedMember.id === this.workspace.owner.id) {
        throw new Error(`Can't delete the workspace owner`);
      }
      remove(this.workspace.members, (member: User) => member.id === selectedMember.id);
      remove(this.workspace.inPendingMembers, (member: User) => member.id === selectedMember.id);
      this.workspaceApiService
        .update({ id: this.workspace.id, payload: this.workspace, currentWorkspace: this.workspace.id })
        .subscribe((workspace) => {
          this.workspace = workspace;
          this.updateTableState();
        });
    } catch (error) {
      this.displayNotificationService.displayNotification(
        new Notification({
          content: error.message,
          type: NotificationType.ERROR,
        }),
      );
    }
  }

  private matches(dataTable: any, term: string) {
    return (
      dataTable.fullName?.toLowerCase().includes(term.toLowerCase()) ||
      dataTable.email?.toLowerCase().includes(term.toLowerCase())
    );
  }

  private updateTableState() {
    this.tableState.totalRecords = this.tableData?.length;
    this.setStatus(this.workspace);
    this.tableState.selectedItems = [];
    this.tableData = [...this.workspace.members, ...this.workspace.inPendingMembers];
  }

  private setStatus(workspace: WorkspaceDTO) {
    workspace.members.forEach((member) => (member.status = MemberStatus.ACTIVE));
    workspace.inPendingMembers.forEach((member) => (member.status = MemberStatus.INPENDING));
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: false,
      tableId: `workspace_members_${this.workspace.id}`,
      responsiveCol: {
        column: 2,
        maxWidth: 15,
      },
      columns: [
        {
          name: 'Name',
          prop: 'fullName',
          sortable: true,
          cellTemplate: this.dataTableTemplates.searchTermTemplate,
          width: 200,
        },
        {
          name: 'Email',
          prop: 'email',
          sortable: true,
          width: 200,
        },
        {
          name: 'Status',
          prop: 'status',
          sortable: true,
          cellTemplate: this.userStatusCellTemplate,
          width: 50,
        },
        {
          name: 'Roles',
          prop: 'roles',
          sortable: true,
          cellTemplate: this.userRoleCellTemplate,
        },
        {
          name: 'Remove',
          prop: '',
          width: 60,
          cellTemplate: this.removeUserTemplate,
        },
      ],
      selectable: false,
      columnsCustomizable: false,
      clientSide: true,
      searchable: false,
      matches: this.matches,
    };
  }

  private displayNotification(user: Partial<User>) {
    this.displayNotificationService.displayNotification(
      new Notification({
        content: `Invitation email was successfully sent to: ${user.email}`,
        type: NotificationType.SUCCESS,
      }),
    );
  }

  private addMemberToWorkspace(options: { workspace: WorkspaceDTO; email: string }): Observable<Partial<User>> {
    const { workspace, email } = options;
    if (!email) {
      return throwError('User email is empty');
    }
    return this.workspaceApiService.inviteUserToWorkspace({ email, workspaceId: workspace.id });
  }
}
