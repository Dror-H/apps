import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { AuthService } from '@app/auth/auth.service';
import { DisplayNotification } from '@app/global/display-notification.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { FakeTranslationLoader } from '@app/shared/shared/fake-translation-loader.helper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
      ],
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: 'LOGIN_PAGE', useValue: '' },
        { provide: DisplayNotification, useValue: {} },
        { provide: AuthApiService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: AnalyticsService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });
});
