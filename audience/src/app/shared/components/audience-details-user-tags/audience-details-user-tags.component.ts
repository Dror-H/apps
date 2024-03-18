import { Component, Input } from '@angular/core';

@Component({
  selector: 'audi-details-user-tags',
  templateUrl: './audience-details-user-tags.component.html',
  styleUrls: ['./audience-details-user-tags.component.scss'],
})
export class AudienceDetailsUserTagsComponent {
  @Input() userTags: string[];
}
