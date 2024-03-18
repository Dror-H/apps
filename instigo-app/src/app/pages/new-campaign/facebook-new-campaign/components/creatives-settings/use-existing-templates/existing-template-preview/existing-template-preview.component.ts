import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdCreativePreview } from '@app/models/new-campaign.model';
import { PreviewBase } from '../../create-new-variations/ad-preview-carousel/preview-base';
import { InstagramAccount, PageType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { AdTemplateService } from '@app/features/ad-template-operation/services/ad-template.service';

@Component({
  selector: 'ingo-existing-template-preview',
  templateUrl: './existing-template-preview.component.html',
  styleUrls: ['./existing-template-preview.component.scss'],
  providers: [AdTemplateService],
})
export class ExistingTemplatePreviewComponent extends PreviewBase implements OnInit {
  @Input() existingAdTemplateForm: FormGroup;
  @Input() adSetFormat = new FormControl();
  public instagramAccountControl: FormControl;
  public instagramAccounts: InstagramAccount[];

  constructor(private adTemplateService: AdTemplateService) {
    super();
  }

  private get instagramAccount(): FormControl {
    return this.existingAdTemplateForm.get('social.instagramAccount') as FormControl;
  }

  public placementPreview(previewType: AdCreativePreview): void {
    this.generatePreviewType(previewType);
    this.existingAdTemplateForm.get('adFormat').setValue(this.previewType[this.isMobile]);
  }

  public previewDevice($event): void {
    this.getPreviewDevice($event);
    this.existingAdTemplateForm.get('adFormat').setValue(this.previewType[this.isMobile]);
  }

  ngOnInit(): void {
    this.instagramAccountControl = this.instagramAccount;
    const pages = this.adTemplateService.getPagesOfAdAccount(
      this.existingAdTemplateForm.get('adAccount').value.id,
      SupportedProviders.FACEBOOK,
    );
    this.instagramAccounts = pages.filter((page) => page.type == PageType.INSTAGRAM) as unknown as InstagramAccount[];
  }
}
