import { NgModule } from '@angular/core';
import { CampaignScheduleComponent } from './campaign-schedule.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { ErrorMessagePipe } from './error-message.pipe';
import { TimeZoneDisplayPipe } from './time-zone-display.pipe';

@NgModule({
  declarations: [CampaignScheduleComponent, ErrorMessagePipe, TimeZoneDisplayPipe],
  imports: [CommonModule, ReactiveFormsModule, UiSharedModule, NzFormModule, NzInputModule, NzAlertModule],
  exports: [CampaignScheduleComponent, ErrorMessagePipe],
})
export class CampaignScheduleModule {}
