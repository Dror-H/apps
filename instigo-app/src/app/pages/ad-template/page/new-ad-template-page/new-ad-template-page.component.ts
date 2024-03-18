import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Router } from '@angular/router';
import { AdTemplateService } from '@app/features/ad-template-operation/services/ad-template.service';
import { SubSink } from 'subsink';
import { AdTemplateFormGeneratorService } from '@app/features/ad-template-operation/services/ad-template-form-generator.service';

@Component({
  selector: 'ingo-new-ad-template-page',
  templateUrl: './new-ad-template-page.component.html',
  styleUrls: ['./new-ad-template-page.component.scss'],
})
export class NewAdTemplatePageComponent implements OnInit, OnDestroy {
  @SelectSnapshot(WorkspaceState.workspaceId)
  workspaceId: string;

  public adTemplateForm: FormGroup;
  private subSink = new SubSink();

  constructor(
    private adTemplateService: AdTemplateService,
    private adTemplateFormService: AdTemplateFormGeneratorService,
    private router: Router,
  ) {}

  public get adAccount(): FormControl {
    return this.settings.get('adAccount') as FormControl;
  }

  public get settings(): FormGroup {
    return this.adTemplateForm.get('settings') as FormGroup;
  }

  public createAdTemplate(): void {
    if (this.adTemplateForm.invalid) {
      return;
    }
    const payload = [];
    const adTemplateName = this.settings.get('adTemplateName').value;
    const adTemplateType = this.settings.get('adTemplateType').value;
    const provider = this.settings.get('provider').value;

    payload.push({
      name: adTemplateName,
      adTemplateType: this.settings.get('adTemplateType').value,
      data: this.adTemplateForm.value[provider.toLowerCase()][adTemplateType.toLowerCase()],
      provider: provider,
      adAccount: this.settings.get('adAccount').value.id,
      workspace: { id: this.workspaceId },
    } as any);
    this.adTemplateService
      .createAdTemplate(payload, adTemplateName)
      .subscribe(() => this.router.navigate(['/ad-templates']));
  }

  public redirectToWorkspace(): void {
    void this.router.navigate(['account-control/workspaces/details', this.workspaceId]);
  }

  ngOnInit() {
    this.adTemplateForm = this.adTemplateFormService.generateAdTemplateForm();
    this.subSink.sink = this.adTemplateFormService.listenOnAdTemplateTypeFormChanges(this.adTemplateForm);
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
