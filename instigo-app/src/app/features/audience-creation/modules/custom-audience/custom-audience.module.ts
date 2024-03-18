import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomAudienceComponent } from './components/custom-audience.component';
import { UiLinkedinModule } from '@instigo-app/ui/linkedin';
import { UiFacebookModule } from '@instigo-app/ui/facebook';

@NgModule({
  declarations: [CustomAudienceComponent],
  imports: [CommonModule, ReactiveFormsModule, UiFacebookModule, UiLinkedinModule],
  exports: [CustomAudienceComponent],
})
export class CustomAudienceModule {}
