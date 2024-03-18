import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FilterByAdAccountComponent } from './filter-by-adaccount.component';
import { FilterByPageComponent } from './filter-by-page.component';
import { FilterByProviderComponent } from './filter-by-provider.component';
import { FilterByStatusComponent } from './filter-by-status.component';
import { FilterByTypeComponent } from './filter-by-type.component';

@NgModule({
  declarations: [
    FilterByAdAccountComponent,
    FilterByProviderComponent,
    FilterByStatusComponent,
    FilterByTypeComponent,
    FilterByPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDropDownModule,
    NzMenuModule,
    NzInputModule,
    NzCheckboxModule,
    NzPopoverModule,
    NzGridModule,
  ],
  exports: [
    FilterByAdAccountComponent,
    FilterByProviderComponent,
    FilterByStatusComponent,
    FilterByTypeComponent,
    FilterByPageComponent,
  ],
  providers: [],
})
export class FilterModule {}
