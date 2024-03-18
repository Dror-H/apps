import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AudienceApiService } from '@audience-app/api/audience-api/audience-api.service';
import { AuthApiService } from '@audience-app/api/auth-api/auth-api.service';
import { TargetingApiService } from '@audience-app/api/targeting-api/targeting-api.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [AudienceApiService, AuthApiService, TargetingApiService],
})
export class RestApiModule {}
