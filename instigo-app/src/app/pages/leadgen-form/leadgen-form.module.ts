import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { FilterModule } from '@app/shared/filters/filter.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CreateLeadFormModalModule } from './create-lead-form-modal/create-lead-form-modal.module';
import { LeadgenFormRoutingModule } from './leadgen-form-routing.module';
import { LeadgenFormComponent } from './leadgen-form.component';

@NgModule({
  declarations: [LeadgenFormComponent],
  imports: [
    CommonModule,
    LeadgenFormRoutingModule,
    DataTableModule,
    CreateLeadFormModalModule,
    FilterModule,
    UiSharedModule,
    NzGridModule,
    NzPageHeaderModule,
    NzCardModule,
    NzTabsModule,
    NzButtonModule,
  ],
})
export class LeadgenFormModule {}
