import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AudienceRoutingModule } from './audience-routing.module';
import { AudienceViewService } from './audience-view.service';
import { AudienceService } from './audience.service';
import { AudienceActionService } from './page/audience-actions.service';

@NgModule({
  imports: [CommonModule, AudienceRoutingModule, NzModalModule],
  providers: [AudienceService, AudienceActionService, AudienceViewService],
})
export class AudienceModule {}
