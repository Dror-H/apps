import { Component, Input, OnInit } from '@angular/core';
import { AdTemplateDTO, AdUpdateDTO } from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { AdTemplateService } from '@app/features/ad-template-operation/services/ad-template.service';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AdTemplateFormGeneratorService } from '@app/features/ad-template-operation/services/ad-template-form-generator.service';

@Component({
  selector: 'app-ad-template-edit-modal',
  templateUrl: './ad-template-edit-modal.component.html',
  styleUrls: ['./ad-template-edit-modal.component.scss'],
  providers: [AdTemplateService],
})
export class AdTemplateEditModalComponent implements OnInit {
  @Input() adTemplate: AdTemplateDTO;
  public adTemplateForm: FormGroup;
  @SelectSnapshot(WorkspaceState.workspaceId)
  workspaceId: string;

  constructor(
    private modal: NzModalRef,
    private modalService: NzModalService,
    private store: Store,
    private fb: FormBuilder,
    private adTemplateService: AdTemplateFormGeneratorService,
  ) {}

  public get settings(): FormGroup {
    return this.adTemplateForm.get('settings') as FormGroup;
  }

  ngOnInit(): void {
    this.adTemplateForm = this.adTemplateService.generateAdTemplateForm(this.adTemplate);
  }

  public update() {
    this.modalService.confirm({
      nzTitle: 'Are you sure?',
      nzContent: 'Update this ad template?',
      nzOkText: 'Yes, update it!',
      nzCancelText: 'No, not yet.',
      nzOnOk: () => {
        const adTemplateType = this.settings.get('adTemplateType').value;
        const provider = this.settings.get('provider').value;

        const payload = {
          name: this.settings.get('adTemplateName').value,
          adTemplateType: adTemplateType,
          data: this.adTemplateForm.value[provider.toLowerCase()][adTemplateType.toLowerCase()],
          provider: provider,
          adAccount: this.settings.get('adAccount').value.id,
          workspace: { id: this.workspaceId },
          providerId: this.adTemplate.providerId,
          id: this.adTemplate.id,
        } as AdUpdateDTO;
        this.modal.close({ payload, id: this.adTemplate.id, name: this.adTemplate.name });
        this.modal.destroy();
      },
      nzOnCancel: () => {
        this.modal.destroy();
      },
    });
  }

  public closeModal(): void {
    this.modal.destroy();
  }
}
