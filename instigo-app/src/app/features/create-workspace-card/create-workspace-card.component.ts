import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserState } from '@app/global/user.state';
import { WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-create-workspace-card',
  templateUrl: './create-workspace-card.component.html',
  styleUrls: ['./create-workspace-card.component.scss'],
})
export class CreateWorkspaceCardComponent implements OnInit {
  @Input()
  isInAccountControl: boolean;

  @Input()
  isDisabled: boolean;

  @Output()
  workspaceCreated = new EventEmitter<Partial<WorkspaceDTO>>();

  public createWorkspaceForm: FormGroup;
  public isFormActive = false;

  private workspace: { name: string; description: string; owner: string; members: [{ id: string }] };

  constructor(private formBuilder: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.createWorkspaceForm = this.formBuilder.group({
      workspace: ['', [Validators.required]],
    });
  }

  public createWorkspace(): void {
    if (this.createWorkspaceForm.valid) {
      this.isFormActive = false;
      const { workspace } = this.createWorkspaceForm.controls;
      const { value: name } = workspace;
      const ownerId = this.store.selectSnapshot(UserState.get).id;
      this.workspace = { name, description: name, owner: ownerId, members: [{ id: ownerId }] };
      this.createWorkspaceForm.controls.workspace.markAsPristine();
      this.createWorkspaceForm.controls.workspace.updateValueAndValidity();
      this.workspaceCreated.emit(this.workspace as unknown as Partial<WorkspaceDTO>);
    }
  }

  public toggleForm(): void {
    if (this.isDisabled) {
      return;
    }
    this.isFormActive = true;
  }
}
