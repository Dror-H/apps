import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { DisplayNotification } from '@app/global/display-notification.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { FakeTranslationLoader } from '@app/shared/shared/fake-translation-loader.helper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { SendResetPasswordComponent } from './send-reset-password.component';

describe('SendResetPasswordComponent: ', () => {
  let component: SendResetPasswordComponent;
  let fixture: ComponentFixture<SendResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
      ],
      declarations: [SendResetPasswordComponent],
      providers: [
        { provide: DisplayNotification, useValue: {} },
        { provide: AnalyticsService, useValue: {} },
        { provide: AuthApiService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
