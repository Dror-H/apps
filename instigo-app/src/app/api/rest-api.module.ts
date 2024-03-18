import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CampaignDraftApiService } from '@app/api/services/campaign-draft.api.service';
import { NotificationApiService } from '@app/api/services/notification-api.service';
import { SubscriptionsApiService } from '@app/api/services/subscriptions.api.service';
import { AdAccountApiService } from './services/ad-account.api.service';
import { AdSetApiService } from './services/ad-set.api.service';
import { AdTemplateApiService } from './services/ad-template.api.service';
import { AdApiService } from './services/ad.api.service';
import { AudienceApiService } from './services/audience.api.service';
import { AuthApiService } from './services/auth.api.service';
import { CampaignApiService } from './services/campaign.api.service';
import { EventsApiService } from './services/events-api.service';
import { FileManagerApiService } from './services/file-manager.api.service';
import { KnowledgebaseApiService } from './services/knowledgebase.service';
import { LeadgenFormApiService } from './services/leadgen-form.api.service';
import { PageApiService } from './services/page-api.service';
import { PaymentsApiService } from './services/payments.api.service';
import { PostApiService } from './services/post.api.service';
import { ReportsApiService } from './services/reports.api.service';
import { TargetingApiService } from './services/target-template.api.service';
import { UploadUtilityApiService } from './services/upload-utility.api.service';
import { UserApiService } from './services/user.api.service';
import { WorkspaceApiService } from './services/workspace.api.service';
import { CampaignGroupsApiService } from '@app/api/services/campaign-groups.api.service';
import { ValidatorApiService } from '@app/api/services/validator-api.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    AdApiService,
    AdSetApiService,
    UserApiService,
    AuthApiService,
    WorkspaceApiService,
    AdAccountApiService,
    CampaignApiService,
    CampaignDraftApiService,
    AudienceApiService,
    AdTemplateApiService,
    TargetingApiService,
    FileManagerApiService,
    UploadUtilityApiService,
    SubscriptionsApiService,
    PostApiService,
    ReportsApiService,
    NotificationApiService,
    KnowledgebaseApiService,
    LeadgenFormApiService,
    EventsApiService,
    PaymentsApiService,
    CampaignGroupsApiService,
    ValidatorApiService,
    PageApiService,
  ],
})
export class RestApiModule {}
