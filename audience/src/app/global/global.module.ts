import { NgModule } from '@angular/core';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  imports: [NzNotificationModule],
  providers: [DisplayNotificationService, AuthService, AudiencesService, ModalService, LoadingService],
})
export class GlobalModule {}
