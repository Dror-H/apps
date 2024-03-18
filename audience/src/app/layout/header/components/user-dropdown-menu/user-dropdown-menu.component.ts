import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';

@Component({
  selector: 'audi-user-dropdown-menu',
  templateUrl: './user-dropdown-menu.component.html',
  styleUrls: ['./user-dropdown-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserDropdownMenuComponent {
  @Input() user: User;
  @Output() signOut = new EventEmitter();
}
