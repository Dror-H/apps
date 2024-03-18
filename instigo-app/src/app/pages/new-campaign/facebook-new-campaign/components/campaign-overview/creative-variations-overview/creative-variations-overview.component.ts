import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MultiVariateCreativesService } from '../../../../services/multi-variate-creatives.service';
import { AdTemplateType, creativeSourceOptions } from '@instigo-app/data-transfer-object';
import { multivariateFields } from '@app/shared/ad-template/ad-template-control.manager';

@Component({
  selector: 'ingo-creatives-variations-overview',
  templateUrl: './creative-variations-overview.component.html',
})
export class CreativeVariationsOverviewComponent implements OnInit, OnDestroy {
  @Input() creativesForm = new FormGroup({});
  public creativeSourceOptions = creativeSourceOptions;
  public value: boolean;
  public adTemplateType = AdTemplateType;
  public multivariateFields = multivariateFields;
  private subSink = new SubSink();

  constructor(private creativesService: MultiVariateCreativesService) {}

  public get existingPost(): FormControl {
    return this.creativesForm.get('existingPost') as FormControl;
  }

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
