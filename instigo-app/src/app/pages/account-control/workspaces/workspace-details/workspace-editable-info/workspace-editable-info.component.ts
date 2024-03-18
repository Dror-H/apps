import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { UserState } from '@app/global/user.state';
import { NotificationType, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';
import { take, tap } from 'rxjs/operators';
import { currencies } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-workspace-editable-info',
  templateUrl: './workspace-editable-info.component.html',
  styleUrls: ['./workspace-editable-info.component.scss'],
})
export class WorkspaceEditableInfoComponent implements OnInit {
  @Input() workspace: WorkspaceDTO;
  @Output() workspaceUpdated = new EventEmitter<any>();
  public editableForm: FormGroup;
  public isEditable = false;
  public existentCurrency: string;
  public currencyList: { label: string; value: string }[] = currencies.map((currency) => ({
    label: currency.Currency,
    value: currency.Code,
  }));

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly displayNotification: DisplayNotification,
    private readonly workspaceApiService: WorkspaceApiService,
  ) {}

  public compareFn = (o1: any, o2: any) => (o1 && o2 ? o1 === o2 : false);

  ngOnInit() {
    this.editableForm = this.formBuilder.group({
      name: [this.workspace.name, [Validators.required, Validators.minLength(3)]],
      currency: [this.workspace.settings.defaultCurrency, [Validators.required]],
      useCachedInsights: [this.workspace.settings?.useCachedInsights || false, [Validators.required]],
    });
  }

  public updateWorkspace(): void {
    this.isEditable = false;
    const payload = {
      name: this.editableForm.value.name,
      settings: {
        ...this.workspace.settings,
        defaultCurrency: this.editableForm.value.currency,
        useCachedInsights: this.editableForm.value.useCachedInsights,
      },
    };
    this.workspaceApiService
      .update({ id: this.workspace.id, payload, currentWorkspace: this.workspace.id })
      .pipe(
        take(1),
        tap(() => {
          this.emitUpdateWorkspace(payload);
        }),
      )
      .subscribe(
        (_) => {
          this.displayNotification.displayNotification(
            new Notification({
              titleId: `app.workspaceDetails.workspaceEditableFields.successMessage`,
              type: NotificationType.SUCCESS,
            }),
          );
        },
        (err) => {
          this.displayNotification.displayNotification(
            new Notification({
              titleId: `app.workspaceDetails.workspaceEditableFields.errorMessage`,
              type: NotificationType.ERROR,
            }),
          );
        },
      );
  }

  public cancelFormEdit(): void {
    this.editableForm.reset();
    this.editableForm.patchValue({
      name: this.workspace.name,
      currency: this.workspace.settings.defaultCurrency,
      useCachedInsights: this.workspace.settings?.useCachedInsights,
    });
    this.isEditable = false;
  }

  public isWorkspaceOwner(): boolean {
    return this.workspace.owner.id === this.store.selectSnapshot(UserState.get).id;
  }

  private emitUpdateWorkspace(payload: { name: string; settings: any }): void {
    this.workspace = { ...this.workspace, ...payload };
    this.workspaceUpdated.emit(this.workspace);
  }
}
