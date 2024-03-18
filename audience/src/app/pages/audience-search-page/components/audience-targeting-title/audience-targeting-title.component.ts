import { Component, Input } from '@angular/core';

@Component({
  selector: 'audi-targeting-title',
  templateUrl: './audience-targeting-title.component.html',
  styleUrls: ['./audience-targeting-title.component.scss'],
})
export class AudienceTargetingTitleComponent {
  @Input() title: string;
}
