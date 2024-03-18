import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AdTemplateDTO } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-ad-preview-carousel-item',
  templateUrl: './ad-preview-carousel-item.component.html',
})
export class AdPreviewCarouselItemComponent {
  private static LAZY_LOADING_THRESHOLD = 1;
  @Input() adTemplateDto: AdTemplateDTO;
  @Input() itemIndex: number;

  public shouldLoadContent = false;
  public previewSourceTypeControl = new FormControl('instigo_preview', [Validators.required]);
  public previewSourceOptions = {
    instigo: {
      name: 'Instigo preview',
      icon: '',
      value: 'instigo_preview',
    },
    facebook: {
      name: 'Facebook preview',
      icon: '',
      value: 'facebook_preview',
    },
    linkedin: {
      name: 'Linkedin preview',
      icon: '',
      value: 'linkedin_preview',
    },
  };

  @Input() set actualIndex(actualIndex: number) {
    if (Math.abs(actualIndex - this.itemIndex) <= AdPreviewCarouselItemComponent.LAZY_LOADING_THRESHOLD) {
      this.shouldLoadContent = true;
    }
  }
}
