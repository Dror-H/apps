import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DashboardAdAccountDropdownSelectorComponent } from './dashboard-ad-account-dropdown-selector.component';

@NgModule({
  declarations: [DashboardAdAccountDropdownSelectorComponent],
  imports: [CommonModule, NzDropDownModule, NzMenuModule, FormsModule],
  exports: [DashboardAdAccountDropdownSelectorComponent],
})
export class DashboardAdAccountDropdownSelectorModule {}
