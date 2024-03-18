import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserbackService } from '@app/shared/analytics/userback.service';
import { facebookInitialize, User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { HotkeysModule } from '@ngneat/hotkeys';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsActionsExecutingModule } from '@ngxs-labs/actions-executing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, NoopNgxsExecutionStrategy } from '@ngxs/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2UirouterModule } from 'angulartics2/uiroutermodule';
import { Base64 } from 'js-base64';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { environment } from 'src/environments/environment';
import { RestApiModule } from './api/rest-api.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalModule } from './global/global.module';
import { IconsProviderModule } from './icons-provider.module';
import { LayoutModule } from './layout/layout.module';
import { SecurityModule } from './security/security.module';
import { NgxSpinnerModule } from 'ngx-spinner';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.3,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // TranslateModule
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
    // NGX
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
      executionStrategy: NoopNgxsExecutionStrategy,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({ name: 'InstigoRedux', disabled: environment.production }),
    NgxsStoragePluginModule.forRoot({
      deserialize: (data) => (environment.production ? JSON.parse(Base64.decode(data)) : JSON.parse(data)),
      serialize: (data) => (environment.production ? Base64.encode(JSON.stringify(data)) : JSON.stringify(data)),
      key: ['auth.token', 'user.user', 'onboarding', 'layout', 'workspace.workspace'],
    }),
    NgxsEmitPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsDispatchPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    NgxsActionsExecutingModule.forRoot(),
    NgxsSelectSnapshotModule.forRoot(),

    // @ngx-loading-bar
    LoadingBarRouterModule,
    LoadingBarModule,
    NgxSpinnerModule,

    // APP Modules
    GlobalModule,
    SecurityModule,
    RestApiModule,
    LayoutModule,
    IconsProviderModule,

    // Angulartics2
    Angulartics2Module.forRoot(),
    Angulartics2UirouterModule,

    // Hotkeys
    HotkeysModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    ...(environment.features.userback
      ? [{ provide: UserbackService, useClass: UserbackService }]
      : [{ provide: UserbackService, useValue: {} }]),
    {
      provide: APP_INITIALIZER,
      useFactory: () => facebookInitialize,
      multi: true,
    },
    Title,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
