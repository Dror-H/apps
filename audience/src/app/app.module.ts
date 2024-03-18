import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RestApiModule } from '@audience-app/api/rest-api.module';
import { AuthModule } from '@audience-app/auth/auth.module';
import { NoActiveSubscriptionModal } from '@audience-app/auth/no-active-subscription-modal/no-active-subscription-modal.module';
import { GlobalModule } from '@audience-app/global/global.module';
import { AuthState } from '@audience-app/store/auth.state';
import { LoadingState } from '@audience-app/store/loading.state';
import { UserState } from '@audience-app/store/user.state';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, NoopNgxsExecutionStrategy } from '@ngxs/store';
import { Base64 } from 'js-base64';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JWTInterceptorService } from './auth/jwt.interceptor';
import { LayoutModule } from './layout/layout.module';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    //NGXS
    NgxsModule.forRoot([UserState, AuthState, LoadingState], {
      developmentMode: !environment.production,
      executionStrategy: NoopNgxsExecutionStrategy,
    }),
    NgxsStoragePluginModule.forRoot({
      deserialize: (data) => (environment.production ? JSON.parse(Base64.decode(data)) : JSON.parse(data)),
      serialize: (data) => (environment.production ? Base64.encode(JSON.stringify(data)) : JSON.stringify(data)),
      key: ['auth.token', 'user', 'audiences.searchHistory', 'audiences.selectedAudiences'],
    }),
    NgxsSelectSnapshotModule.forRoot(),
    NgxsEmitPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({ name: 'AudiencesRedux', disabled: environment.production }),

    // APP Modules
    LayoutModule,
    AuthModule,
    GlobalModule,
    RestApiModule,
    NoActiveSubscriptionModal,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
