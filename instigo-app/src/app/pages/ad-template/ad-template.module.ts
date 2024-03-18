import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdTemplateServiceModule } from '@app/features/ad-template-operation/services/ad-template-service.module';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { FilterModule } from '@app/shared/filters/filter.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AdTemplateRoutingModule } from './ad-template-routing.module';
import { AdTemplatesPageComponent } from './page/ad-template-page/ad-templates-page.component';
import { NewAdTemplatePageModule } from './page/new-ad-template-page/new-ad-template-page.module';
import { AdTemplatesViewComponent } from './view/ad-templates-view.component';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [AdTemplatesPageComponent, AdTemplatesViewComponent],
  imports: [
    CommonModule,
    AdTemplateServiceModule,
    FilterModule,
    AdTemplateRoutingModule,
    DataTableModule,
    NewAdTemplatePageModule,
    UiSharedModule,
    NzGridModule,
    NzPageHeaderModule,
    NzTabsModule,
    NzButtonModule,
    NzToolTipModule,
    NzModalModule,
    UiSharedModule,
  ],
})
export class AdTemplateModule {}
