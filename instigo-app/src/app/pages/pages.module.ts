import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '@app/global/global.module';
import { NgxsModule } from '@ngxs/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SessionState } from './adaccount-dashboard/session-state.state';
import { PagesRoutingModule } from './pages-routing.module';
import { WorkspaceState } from './state/workspace.state';

@NgModule({
  declarations: [],
  imports: [
    GlobalModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    PerfectScrollbarModule,
    NgxsModule.forFeature([WorkspaceState, SessionState]),
  ],
  providers: [],
})
export class PagesModule {}
