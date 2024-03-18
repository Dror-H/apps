import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeTranslationLoader } from '@app/shared/shared/fake-translation-loader.helper';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { of } from 'rxjs';
import { Page404Component } from './page404.component';

describe('Page404Component: ', () => {
  let component: Page404Component;
  let fixture: ComponentFixture<Page404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
        RouterTestingModule,
        NzEmptyModule,
      ],
      declarations: [Page404Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ code: '4_100' }),
            snapshot: { queryParams: { code: '4_100' } },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
