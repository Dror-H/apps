import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionButtonConfig } from '@audience-app/shared/components/action-buttons/action-buttons.models';

@Component({
  selector: 'audi-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonsComponent {
  @Input() public actionButtons: ActionButtonConfig<string>[];
  @Output() public clickEvent = new EventEmitter<string>();

  public onClick(index: number, action: string): void {
    this.setCurrentActiveButton(index);
    this.clickEvent.emit(action);
  }

  private setCurrentActiveButton(index: number): void {
    this.actionButtons = this.actionButtons.map((btn, i) =>
      i === index ? { ...btn, active: true } : { ...btn, active: false },
    );
  }
}
