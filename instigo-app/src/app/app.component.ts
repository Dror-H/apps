import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import Chart from 'chart.js';
import { ActivationStart, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AnalyticsService } from './shared/analytics/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @ViewChild('nzIndicatorTpl', { static: true })
  nzIndicator!: TemplateRef<void>;

  constructor(
    private translate: TranslateService,
    private readonly nzConfigService: NzConfigService,
    private titleService: Title,
    private router: Router,
    private analytics: AnalyticsService,
  ) {
    analytics.start();
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.nzConfigService.set('select', { nzSuffixIcon: this.nzIndicator });
    this.nzConfigService.set('notification', { nzDuration: 6000 });
    Chart.defaults.global.defaultFontFamily = '"proxima-nova", sans-serif';
    Chart.defaults.global.defaultFontSize = 14;
    Chart.defaults.global.legend.labels.fontSize = 15;
    Chart.defaults.global.legend.labels.fontStyle = '500';
    Chart.defaults.global.legend.labels.boxWidth = 200;

    this.router.events.pipe().subscribe((event) => {
      if (event instanceof ActivationStart) {
        const title = event.snapshot.data['title'];
        this.titleService.setTitle((title && `${event.snapshot.data['title']} | Instigo`) || 'Instigo');
      }
    });
  }
}
