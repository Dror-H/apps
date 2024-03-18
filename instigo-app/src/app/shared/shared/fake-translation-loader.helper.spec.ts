import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { FakeTranslationLoader } from './fake-translation-loader.helper';

describe('TranslateLoader', () => {
  let translate: TranslateService;

  it('should be able to provide TranslateStaticLoader', () => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
      ],
    });
    translate = TestBed.inject(TranslateService);

    expect(translate).toBeDefined();
    expect(translate.currentLoader).toBeDefined();
    expect(translate.currentLoader instanceof FakeTranslationLoader).toBeTruthy();

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    // this will request the translation from the backend because we use a static files loader for TranslateService
    translate.get('TEST').subscribe((res: string) => {
      expect(res).toEqual('This is a test');
    });
  });

  it('should be able to provide any TranslateLoader', () => {
    class CustomLoader implements TranslateLoader {
      getTranslation(lang: string): Observable<any> {
        return of({ test: 'This is also a test' });
      }
    }

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: CustomLoader },
        }),
      ],
    });
    translate = TestBed.get(TranslateService);

    expect(translate).toBeDefined();
    expect(translate.currentLoader).toBeDefined();
    expect(translate.currentLoader instanceof CustomLoader).toBeTruthy();

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    // this will request the translation from the CustomLoader
    translate.get('test').subscribe((res: string) => {
      expect(res).toEqual('This is also a test');
    });
  });
});
