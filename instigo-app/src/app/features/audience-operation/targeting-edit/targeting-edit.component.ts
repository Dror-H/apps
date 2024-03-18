import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { AudienceType, NotificationType, TargetingDto, TargetingTemplateDto } from '@instigo-app/data-transfer-object';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'ingo-targeting-edit',
  templateUrl: './targeting-edit.component.html',
})
export class TargetingEditComponent implements OnInit {
  @Input() targetingTemplate: TargetingTemplateDto;
  public existingRules: TargetingDto = null;
  public audienceForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private displayNotification: DisplayNotification,
    private targetingApiService: TargetingApiService,
  ) {}

  ngOnInit(): void {
    this.existingRules = cloneDeep(this.targetingTemplate?.rules);
    this.audienceForm = this.fb.group({
      audienceType: [AudienceType.SAVED_AUDIENCE, [Validators.required]],
      audienceSubType: [null],
      adAccount: [this.targetingTemplate.adAccount, [Validators.required]],
      provider: ['facebook', [Validators.required]],
      description: [this.targetingTemplate.description],
      name: [this.targetingTemplate.name],
      reach: [this.fb.control('')],
      target: [],
      isCampaignCreation: [true],
    });
  }

  public update(): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure?',
      nzContent: 'Update this ad targeting',
      nzOkText: 'Yes, update it!',
      nzCancelText: 'No, not yet',
      nzOnOk: () => {
        const payload = {
          rules: {
            ...this.audienceForm.value.target,
          },
        } as any;
        return this.targetingApiService
          .update({ id: this.targetingTemplate.id, payload })
          .pipe(take(1))
          .subscribe(() => {
            this.displayNotification.displayNotification(
              new Notification({
                title: `${this.audienceForm.value.name} audience has been updated`,
                type: NotificationType.SUCCESS,
              }),
            );
          });
      },
      nzOnCancel: () => {},
    });

    this.modal.destroy();
  }

  public closeModal(): void {
    this.modal.destroy();
  }
}
