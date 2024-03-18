import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AdAccountDTO,
  AdSetDTO,
  AudienceType,
  SupportedProviders,
  TargetingDto,
} from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { QuickActionsService } from '@app/pages/campaigns/quick-actions.service';

@Component({
  selector: 'ingo-camp-targeting-edit',
  templateUrl: './campaign-targeting-edit.component.html',
})
export class CampaignTargetingEditComponent implements OnInit {
  @Input() savedAudienceTemplate;
  public existingRules: TargetingDto = null;
  public audienceForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private store: Store,
    private quickActions: QuickActionsService,
  ) {}

  ngOnInit(): void {
    this.existingRules = this.savedAudienceTemplate?.rules;
    this.audienceForm = this.fb.group({
      audienceType: [AudienceType.SAVED_AUDIENCE, [Validators.required]],
      audienceSubType: [null],
      adAccount: [this.savedAudienceTemplate.adAccount, [Validators.required]],
      provider: ['facebook', [Validators.required]],
      description: [this.savedAudienceTemplate.description],
      name: [this.savedAudienceTemplate.name],
      reach: [this.fb.control('')],
      target: [],
      isCampaignCreation: [true],
    });
  }

  public update(): void {
    this.modalService.confirm({
      nzTitle: 'Update the ad set targeting?',
      nzContent: 'Are you sure you want to update the ad set targeting?',
      nzOkText: 'Yes, update!',
      nzCancelText: 'No, not yet',
      nzOnOk: () => {
        const adSets: Partial<AdSetDTO>[] = [
          {
            providerId: this.savedAudienceTemplate.providerId,
            name: this.audienceForm.value.name as string,
            adAccount: this.audienceForm.value.adAccount as AdAccountDTO,
            provider: this.audienceForm.value.provider as SupportedProviders,
            id: this.savedAudienceTemplate.id,
            targeting: {
              ...this.audienceForm.value.target,
            },
          },
        ];
        this.quickActions.updateAdSetFields({ adSets }).subscribe(this.refresh.bind(this));
      },
      nzOnCancel: () => {},
    });

    this.modal.destroy();
  }

  public closeModal(): void {
    this.modal.destroy();
  }

  private refresh(): void {
    window.location.reload();
  }
}
