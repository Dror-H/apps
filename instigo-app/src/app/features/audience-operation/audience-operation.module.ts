import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TargetingEditModule } from './targeting-edit/targeting-edit.module';
import { AudienceOperationRoutingModule } from './audience-operation-routing.module';
import { TargetingResolver } from './targeting.resolver';
import { AudienceResolver } from './audience.resolver';
import { SavedAudienceEditModule } from './saved-audience-edit/saved-audience-edit.module';
import { AudienceService } from '../../pages/audience/audience.service';
import { WebsiteAudienceEditModule } from './website-audience-edit/website-audience-edit.module';

@NgModule({
  imports: [
    CommonModule,
    AudienceOperationRoutingModule,
    TargetingEditModule,
    SavedAudienceEditModule,
    WebsiteAudienceEditModule,
  ],
  providers: [TargetingResolver, AudienceResolver, AudienceService],
})
export class AudienceOperationModule {}
