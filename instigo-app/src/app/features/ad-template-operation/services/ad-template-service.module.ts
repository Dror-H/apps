import { NgModule } from '@angular/core';
import { AdTemplateService } from '@app/features/ad-template-operation/services/ad-template.service';
import { AdTemplateFormGeneratorService } from '@app/features/ad-template-operation/services/ad-template-form-generator.service';

@NgModule({ providers: [AdTemplateService, AdTemplateFormGeneratorService] })
export class AdTemplateServiceModule {}
