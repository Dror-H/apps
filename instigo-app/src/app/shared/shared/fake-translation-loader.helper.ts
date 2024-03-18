import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export class FakeTranslationLoader implements TranslateLoader {
  getTranslation(language: string): Observable<any> {
    return of({ test: 'This is a test' });
  }
}
