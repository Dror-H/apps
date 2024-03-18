import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacebookLookalikeAudienceModule } from './components/facebook-lookalike-audience/facebook-lookalike-audience.module';
import { LinkedinLookalikeAudienceModule } from './components/linkedin-lookalike-audience/linkedin-lookalike-audience.module';
import { LookalikeAudienceComponent } from './components/lookalike-audience.components';

@NgModule({
  declarations: [LookalikeAudienceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FacebookLookalikeAudienceModule,
    LinkedinLookalikeAudienceModule,
  ],
  exports: [LookalikeAudienceComponent],
  providers: [],
})
export class LookalikeAudienceModule {}
