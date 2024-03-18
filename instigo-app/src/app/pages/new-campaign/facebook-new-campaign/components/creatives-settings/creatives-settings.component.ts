import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { creativeSourceOptions, FacebookCreativeSource } from '@instigo-app/data-transfer-object';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'ingo-nc-creatives-settings',
  templateUrl: './creatives-settings.component.html',
  styleUrls: ['./creatives-settings.component.scss'],
})
export class NCCreativesSettingsComponent implements OnInit {
  @Input() campaignCreatives = new FormGroup({});

  public creativeSourceOptions = cloneDeep(creativeSourceOptions);
  public activatedNumber: number;

  private get creativesSourceType(): FormControl {
    return this.campaignCreatives.get('sourceType') as FormControl;
  }

  public creativeActiveSource(id: number): void {
    this.creativesSourceType.setValue(id);
  }

  ngOnInit(): void {
    const campaignObjective = this.campaignCreatives.parent.get('settings.objective').value;
    if (campaignObjective === 'POST_ENGAGEMENT') {
      this.creativeSourceOptions.forEach((option: any) => {
        if (option.id !== FacebookCreativeSource.USE_POSTS) {
          option.active = false;
        }
      });
    }
    if (
      campaignObjective === 'VIDEO_VIEWS' ||
      campaignObjective === 'LEAD_GENERATION' ||
      campaignObjective === 'PAGE_LIKES' ||
      campaignObjective === 'EVENT_RESPONSES'
    ) {
      this.creativeSourceOptions.forEach((option: any) => {
        if (option.id !== FacebookCreativeSource.CREATE_NEW_VARIATIONS) {
          option.active = false;
        }
      });
    }
  }
}
