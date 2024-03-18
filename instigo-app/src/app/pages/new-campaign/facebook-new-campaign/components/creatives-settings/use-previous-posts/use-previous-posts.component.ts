import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FacebookAdTemplateGeneratorService } from '@app/pages/new-campaign/facebook-new-campaign/services/facebook-ad-template-generator.service';
import {
  AdAccountDTO,
  AdTemplateDTO,
  AdTemplateType,
  convertFormAdTemplateToAdTemplateDTO,
  PageDTO,
  PageType,
  PostDTO,
  transformPostToAdTemplateDto,
} from '@instigo-app/data-transfer-object';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'ingo-user-previous-posts',
  templateUrl: './use-previous-posts.component.html',
})
export class UsePreviousPostsComponent implements OnInit {
  @Input() campaignCreatives = new FormGroup({});

  public selectedPost: PostDTO = null;
  public canSelectedPostBeUsedInAds = false;
  public newExistingPostForm: FormGroup;
  public isSelectionOpen = false;
  public instagramAccounts: PageDTO[];
  public igSelectorTooltipClass: string = null;
  public adAccountValue: AdAccountDTO;
  public campaignObjective: string;

  constructor(
    private readonly modalService: NzModalService,
    private adTemplateGenerator: FacebookAdTemplateGeneratorService,
  ) {}

  public get adSetFormat(): FormControl {
    return this.campaignCreatives.parent.get('adSetFormat') as FormControl;
  }

  private get existingSelectedPostForm(): FormGroup {
    return this.campaignCreatives.get('existingPost.selectedPost') as FormGroup;
  }

  private set existingSelectedPostForm(formGroup: FormGroup) {
    if ((this.campaignCreatives.get('existingPost') as FormGroup).contains('selectedPost')) {
      (this.campaignCreatives.get('existingPost') as FormGroup).removeControl('selectedPost');
    }
    (this.campaignCreatives.get('existingPost') as FormGroup).addControl('selectedPost', formGroup);
  }

  private get campaignObjectiveControl(): FormGroup {
    return this.campaignCreatives.parent.get('settings.objective') as FormGroup;
  }

  ngOnInit(): void {
    this.adAccountValue = this.campaignCreatives.parent.get('settings.account').value as AdAccountDTO;
    this.instagramAccounts = this.adAccountValue?.pages?.filter((page) => page.type === PageType.INSTAGRAM);
    this.campaignObjective = this.campaignObjectiveControl.value;

    if (this.existingSelectedPostForm?.value != null) {
      if (this.existingSelectedPostForm.value.adTemplateType === AdTemplateType.EXISTING_POST) {
        this.selectedPost = this.convertToPost();
        this.setExistingPost();
        this.canSelectedPostBeUsedInAds = true;
      } else {
        this.createAdTemplateFromExistingPostWithMissingData(
          convertFormAdTemplateToAdTemplateDTO(this.existingSelectedPostForm.value),
        );
        this.canSelectedPostBeUsedInAds = false;
      }
      this.igSelectorTooltipClass = `app.campCreate.creative.${
        this.existingSelectedPostForm.value.isInstagramEligible ? 'igAccount' : 'igIneligiblePost'
      }`;
    } else {
      this.isSelectionOpen = true;
    }
  }

  public confirmPostSelection(selectedPost?: PostDTO): void {
    this.isSelectionOpen = false;
    if (!selectedPost) {
      this.selectedPost = null;
      return;
    }
    this.selectedPost = selectedPost;
    this.igSelectorTooltipClass = `app.campCreate.creative.${
      this.selectedPost?.data?.isInstagramEligible ? 'igAccount' : 'igIneligiblePost'
    }`;
    this.canSelectedPostBeUsedInAds = this.selectedPost.data.canBeUseInAds;
    if (this.canSelectedPostBeUsedInAds) {
      this.setExistingPost();
    } else {
      this.newExistingPostForm = null;
      this.displayConfirm(selectedPost);
    }
  }

  private convertToPost(): PostDTO {
    const existingPost = this.existingSelectedPostForm.value;
    return {
      ...existingPost,
      data: {
        message: existingPost.message,
        isInstagramEligible: existingPost.isInstagramEligible,
        attachments: { title: existingPost.headline },
      },
    };
  }

  private displayConfirm(selectedPost: PostDTO) {
    this.modalService.confirm({
      nzTitle: 'Create a new post',
      nzContent:
        '<b style="color: red;">This post doesn\'t have attached a link or a call to action button. In order to create an ad from this post, we need to create a new unpublished post, from it, and you also need to fill additional fields. (like url or call to action button)</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.createContextForNewPost(selectedPost),
      nzCancelText: 'No',
      nzCentered: true,
      nzOnCancel: () => ((this.selectedPost = null), (this.isSelectionOpen = true)),
    });
  }

  private createContextForNewPost(selectedPost: PostDTO) {
    const adTemplateFromPost = transformPostToAdTemplateDto(selectedPost, this.adAccountValue);
    this.createAdTemplateFromExistingPostWithMissingData(adTemplateFromPost);
    this.existingSelectedPostForm = this.newExistingPostForm;
  }

  private createAdTemplateFromExistingPostWithMissingData(adTemplate: AdTemplateDTO): void {
    this.newExistingPostForm =
      adTemplate.adTemplateType === AdTemplateType.IMAGE
        ? this.adTemplateGenerator.generateImageAdTemplate(adTemplate)
        : this.adTemplateGenerator.generateVideoAdTemplate(adTemplate);
    if (!this.newExistingPostForm.value.message) {
      this.newExistingPostForm.controls.message.disable();
    }
  }

  private createAdTemplateFromExistingPost(): void {
    this.newExistingPostForm = this.adTemplateGenerator.generateImageAdTemplateExistingPost({
      ...this.selectedPost,
      adAccount: this.adAccountValue,
    });
  }

  private setExistingPost(): void {
    this.createAdTemplateFromExistingPost();
    this.existingSelectedPostForm = this.newExistingPostForm;
  }
}
