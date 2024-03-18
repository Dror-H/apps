import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { AuthService } from '@app/auth/auth.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { FakeTranslationLoader } from '@app/shared/shared/fake-translation-loader.helper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';

@Component({
  template: `<div></div>`,
  selector: 'app-social-login',
})
class MockSocialLoginComponent {
  @Input() actionType: string;
}

describe('LoginComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NzToolTipModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
        RouterTestingModule,
      ],
      declarations: [RegisterComponent, MockSocialLoginComponent],
      providers: [
        { provide: 'LOGIN_PAGE', useValue: '' },
        { provide: AuthApiService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: AnalyticsService, useValue: {} },
        { provide: ActivatedRoute, useValue: { queryParams: of() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });
});
