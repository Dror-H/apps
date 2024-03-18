import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdTemplateType } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'app-ad-templates-edit-page',
  templateUrl: './ad-template-editpage.component.html',
})
export class AdTemplateEditpageComponent {
  @Input() adTemplateForm: FormGroup = new FormGroup({});
  @Input() withCard = true;

  public adType = AdTemplateType;
}
