import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AudienceType, TargetingDto, TargetingTemplateDto } from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AudienceService } from '@app/pages/audience/audience.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ingo-saved-audience-edit',
  templateUrl: './saved-audience-edit.component.html',
})
export class SavedAudienceEditComponent implements OnInit {
  @Input() savedAudienceTemplate;
  public existingRules: TargetingDto = null;
  public audienceForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private store: Store,
    private audienceApiService: AudienceService,
    private router: Router,
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
      nzTitle: 'Create a targeting?',
      nzContent: 'Are you sure you want to create a new targeting from this saved audience?',
      nzOkText: 'Yes, create new Targeting!',
      nzCancelText: 'No, not yet',
      nzOnOk: () => {
        const providers = this.audienceForm.value.provider;
        const payload: Partial<TargetingTemplateDto>[] = [
          {
            name: this.audienceForm.value.name,
            adAccount: this.audienceForm.value.adAccount,
            type: this.audienceForm.value.audienceType,
            provider: this.audienceForm.value.provider,
            rules: {
              ...this.audienceForm.value.target,
            },
            size: this.audienceForm.value.reach.count,
          },
        ];
        this.audienceApiService.callApiSavedAudience(payload, providers).subscribe(this.goToAudiences.bind(this));
      },
      nzOnCancel: () => {},
    });

    this.modal.destroy();
  }

  public closeModal(): void {
    this.modal.destroy();
  }

  private goToAudiences(): void {
    this.router.navigate(['audiences']);
  }
}
