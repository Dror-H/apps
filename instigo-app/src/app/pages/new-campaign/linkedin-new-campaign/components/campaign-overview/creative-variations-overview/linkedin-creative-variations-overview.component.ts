import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdTemplateType } from '@instigo-app/data-transfer-object';
import { switchMap, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { SubSink } from 'subsink';
import { MultiVariateCreativesService } from '@app/pages/new-campaign/services/multi-variate-creatives.service';
import { multivariateFields } from '@app/shared/ad-template/ad-template-control.manager';

@Component({
  selector: 'ingo-linkedin-creative-variations-overview',
  templateUrl: './linkedin-creative-variations-overview.component.html',
})
export class LinkedinCreativeVariationsOverviewComponent implements OnInit, OnDestroy {
  @Input() creativesForm = new FormGroup({});
  public value: boolean;
  public adTemplateType = AdTemplateType;
  public multivariateFields = multivariateFields;

  private subSink = new SubSink();

  constructor(private creativesService: MultiVariateCreativesService) {}

  ngOnInit(): void {
    this.subSink.sink = this.creativesService.canAddVariation
      .pipe(
        tap((change) => (this.value = change)),
        switchMap(() => timer(1000).pipe(tap(() => (this.value = true)))),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
