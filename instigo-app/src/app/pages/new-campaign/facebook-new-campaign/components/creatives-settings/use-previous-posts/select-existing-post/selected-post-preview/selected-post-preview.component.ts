import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdCreativePreview } from '@app/models/new-campaign.model';
import { PreviewBase } from '../../../create-new-variations/ad-preview-carousel/preview-base';
import { AdTemplateType } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-selected-post-preview',
  templateUrl: './selected-post-preview.component.html',
  styleUrls: ['./selected-post-preview.component.scss'],
})
export class SelectedPostPreviewComponent extends PreviewBase implements OnInit {
  @Input() existingPostForm = new FormGroup({});
  @Input() adSetFormat = new FormControl();
  public instagramAccountControl: FormControl;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.instagramAccountControl = this.getInstagramAccountControl();
  }

  public placementPreview(previewType: AdCreativePreview): void {
    this.generatePreviewType(previewType);
    this.existingPostForm.get('adFormat').setValue(this.previewType[this.isMobile]);
  }

  public previewDevice($event: number) {
    this.getPreviewDevice($event);
    this.existingPostForm.get('adFormat').setValue(this.previewType[this.isMobile]);
  }

  private getInstagramAccountControl(): FormControl {
    const adTemplateType = this.existingPostForm.value.adTemplateType;
    if (adTemplateType === AdTemplateType.EXISTING_POST) {
      return this.existingPostForm.get('instagramAccount') as FormControl;
    }
    return this.existingPostForm.get('social')?.get('instagramAccount') as FormControl;
  }
}
