import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AudienceService } from '@app/pages/audience/audience.service';
import { AdAccountDTO, TargetingDto, TargetingTemplateDto } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-website-audience-edit',
  templateUrl: './website-audience-edit.component.html',
})
export class WebsiteAudienceEditComponent implements OnInit {
  @Input() websiteAudienceTemplate;
  public rules: TargetingDto = null;
  public adAccount: AdAccountDTO;
  public name: string;
  public audienceRules: FormControl;
  public isRulesValid = true;

  constructor(
    private readonly fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private audienceApiService: AudienceService,
  ) {
    this.audienceRules = new FormControl();
  }

  ngOnInit(): void {
    this.rules = this.websiteAudienceTemplate?.rules;
    this.adAccount = this.websiteAudienceTemplate?.adAccount;
    this.name = this.websiteAudienceTemplate?.name;

    this.audienceRules.setValue(this.rules);

    this.audienceRules.valueChanges.subscribe((change) => {
      this.rules = change.rule;
      this.isRulesValid = change.valid;
    });
  }

  public update(): void {
    this.modalService.confirm({
      nzTitle: 'Update website custom audience?',
      nzContent: 'Are you sure to update this website custom audience?',
      nzOkText: 'Yes, update it!',
      nzCancelText: 'No, not yet',
      nzOnOk: () => {
        const payload: Partial<TargetingTemplateDto>[] = [
          {
            id: this.websiteAudienceTemplate.id,
            provider: this.websiteAudienceTemplate.provider,
            providerId: this.websiteAudienceTemplate.providerId,
            name: this.name,
            rules: this.rules,
          },
        ];
        return this.audienceApiService.callApiUpdateAudience(payload).subscribe();
      },
      nzOnCancel: () => {},
    });

    this.modal.destroy();
  }

  public closeModal(): void {
    this.modal.destroy();
  }
}
