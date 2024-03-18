import { NgModule } from '@angular/core';
import { LinkedinCreativeSettingsComponent } from './linkedin-creative-settings.component';
import { LinkedinMultivariateAdsModule } from './multivariate-ads/linkedin-multivariate-ads.module';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [LinkedinCreativeSettingsComponent],
  imports: [LinkedinMultivariateAdsModule, NzCardModule],
  exports: [LinkedinCreativeSettingsComponent],
})
export class LinkedinCreativeSettingsModule {}
