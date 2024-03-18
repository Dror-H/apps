import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PromotePage } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-promote-page-dropdown',
  templateUrl: './promote-page-dropdown.component.html',
})
export class PromotePageDropdownComponent {
  @Input() promotePages: PromotePage[] = [];
  @Output() onSelectionEvent = new EventEmitter<PromotePage>();
  selectedValue = null;

  constructor() {}

  onSelection(promotePage: PromotePage): void {
    this.onSelectionEvent.emit(promotePage);
    this.selectedValue = null;
  }
}
