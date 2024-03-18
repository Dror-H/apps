import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionBoxClickEvents } from '@audience-app/shared/components/action-box/action-box.models';

@Component({
  selector: 'audi-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBoxComponent {
  @Output() public clickEvent = new EventEmitter<ActionBoxClickEvents>();
  @Input() public disabled: boolean;
  @Input() public loading: boolean;
}
