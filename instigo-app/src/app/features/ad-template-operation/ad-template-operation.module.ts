import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdTemplateModalTriggerComponent } from './ad-template-modal-trigger.component';
import { AdTemplateOperationRoutingModule } from './ad-template-operation-routing.module';
import { AdTemplateResolver } from './ad-template.resolver';
import { AdTemplateEditModalModule } from './modules/ad-template-edit-modal/ad-template-edit-modal.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AdTemplateServiceModule } from '@app/features/ad-template-operation/services/ad-template-service.module';

@NgModule({
  declarations: [AdTemplateModalTriggerComponent],
  imports: [
    CommonModule,
    NzModalModule,
    AdTemplateOperationRoutingModule,
    AdTemplateEditModalModule,
    AdTemplateServiceModule,
  ],
  providers: [AdTemplateResolver],
})
export class AdTemplateOperationModule {}
