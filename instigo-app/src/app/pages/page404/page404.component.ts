import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss'],
})

/**
 * PAges-404 component
 */
export class Page404Component implements OnInit {
  public error_message: Observable<string>;

  constructor(private readonly activeRoute: ActivatedRoute, private readonly translate: TranslateService) {}

  ngOnInit() {
    this.error_message = this.translate.get('app.error_codes.default_404');
    this.replaceDefaultErrorMessageWithTranslationInCaseOfExistingTranslation();
  }

  private replaceDefaultErrorMessageWithTranslationInCaseOfExistingTranslation() {
    const { code } = this.activeRoute.snapshot.queryParams;
    if (code) {
      const translateid = `app.error_codes.${code}`;
      this.translate
        .get(translateid)
        .pipe(filter((message) => message !== translateid))
        .subscribe((message) => {
          this.error_message = of(message);
        });
    }
  }
}
