import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AudienceApiService } from '@audience-app/api/audience-api/audience-api.service';
import { TargetingApiService } from '@audience-app/api/targeting-api/targeting-api.service';
import { AudienceEditPageRoutingModule } from '@audience-app/pages/audience-edit-page/audience-edit-page-routing.module';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import {
  AUDIENCES_API_SERVICE,
  ENVIRONMENT,
  PendingChangesGuard,
  STORE,
  TARGETING_API_SERVICE,
  UiSharedModule,
} from '@instigo-app/ui/shared';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { environment } from 'src/environments/environment';
import { AudienceEditPageComponent } from './audience-edit-page.component';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { AudiencesState } from '@audience-app/store/audiences.state';

@NgModule({
  declarations: [AudienceEditPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AudienceEditPageRoutingModule,
    UiFacebookModule,
    UiSharedModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzCardModule,
    NzButtonModule,
    NzAffixModule,
    NgxsModule.forFeature([AudiencesState]),
    TranslateModule,
  ],
  providers: [
    { provide: PendingChangesGuard, useClass: PendingChangesGuard },
    { provide: STORE, useExisting: Store },
    { provide: TARGETING_API_SERVICE, useClass: TargetingApiService },
    { provide: AUDIENCES_API_SERVICE, useExisting: AudienceApiService },
    { provide: ENVIRONMENT, useValue: environment },
  ],
})
export class AudienceEditPageModule {}
