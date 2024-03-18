import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgPipesModule } from 'ngx-pipes';
import { DataTableTemplatesComponent } from './cell-template/data-table-templates.component';
import { DataTableColumnEditModalComponent } from './components/data-table-column-edit.component';
import { DataTableColumnsToggleComponent } from './components/data-table-columns-toggle.component';
import { DataTableQuickActionsComponent } from './components/data-table-quick-actions.component';
import { DataTableSearchBarComponent } from './components/data-table-search-bar.component';
import { DataTableComponent } from './data-table/data-table.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { RouterModule } from '@angular/router';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { SharedModule } from '../shared/shared.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AudienceShortenTypePipe } from '@app/shared/data-table/data-table/audience-shorten-type.pipe';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgPipesModule,
    PerfectScrollbarModule,
    UiSharedModule,
    NzTableModule,
    NzButtonModule,
    NzDropDownModule,
    NzToolTipModule,
    NzGridModule,
    NzCheckboxModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzSelectModule,
    NzDividerModule,
  ],
  declarations: [
    AudienceShortenTypePipe,
    DataTableComponent,
    DataTableSearchBarComponent,
    DataTableQuickActionsComponent,
    DataTableColumnsToggleComponent,
    DataTableColumnEditModalComponent,
    DataTableTemplatesComponent,
  ],
  exports: [DataTableComponent, DataTableTemplatesComponent],
})
export class DataTableModule {}
