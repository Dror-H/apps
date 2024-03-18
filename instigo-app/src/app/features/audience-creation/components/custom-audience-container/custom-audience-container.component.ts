import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdAccountDTO, AudienceDto, AudienceType } from '@instigo-app/data-transfer-object';
import { differenceBy } from 'lodash-es';
import { AUDIENCE_PAGINATION_SIZE } from '@app/global/utils';
import { FormGroup } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs/operators';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { SubSink } from 'subsink';
import { AudienceApiService } from '@app/api/services/audience.api.service';

@Component({
  selector: 'ingo-custom-audience-container',
  templateUrl: './custom-audience-container.component.html',
})
export class CustomAudienceContainerComponent implements OnInit {
  @Input() demographicsForm: FormGroup;
  @Input() adAccount: AdAccountDTO;
  public audienceSource$ = new BehaviorSubject<AudienceDto[]>([]);
  public shouldLoadMore: boolean;
  public audienceList: AudienceDto[] = [];
  public loadMoreAudiences$ = new BehaviorSubject(0);

  private subSink = new SubSink();

  constructor(private readonly audienceApiService: AudienceApiService) {}

  public updateAudiences(): void {
    const customAudienceValue = this.demographicsForm.get('customAudiences').value;
    const selectedAudiencesList = [...customAudienceValue.include, ...customAudienceValue.exclude];
    this.audienceSource$.next(differenceBy(this.audienceList, selectedAudiencesList, 'providerId'));
  }

  public loadMoreCustomAudiences() {
    const previousValue = this.loadMoreAudiences$.value;
    this.loadMoreAudiences$.next(previousValue + AUDIENCE_PAGINATION_SIZE);
  }

  ngOnInit(): void {
    this.setCustomAudienceList();
  }

  private setCustomAudienceList(): void {
    this.subSink.sink = this.loadMoreAudiences$
      .pipe(
        switchMap((offset) => this.getAudiences(offset, '').pipe(map((items) => ({ offset, items })))),
        tap(({ offset, items }) => (this.shouldLoadMore = offset + AUDIENCE_PAGINATION_SIZE < (items as any).total)),
      )
      .subscribe(({ offset, items }) => {
        const audiences = (items as any).data;
        this.audienceList.push(...audiences);
        const previousValue = this.audienceSource$.value;
        previousValue.push(...audiences);
        this.audienceSource$.next(previousValue);
        this.updateAudiences();
      });
  }

  private getAudiences(offset: number, searchTerm = ''): Observable<AudienceDto[]> {
    return this.audienceApiService.findAll(this.buildAudienceQuery(offset, searchTerm).query());
  }

  private buildAudienceQuery(offset = 0, searchTerm?: string): RequestQueryBuilder {
    const qb = RequestQueryBuilder.create();
    const queryBuild = qb
      .setFilter({ field: 'provider', operator: CondOperator.EQUALS, value: this.adAccount.provider })
      .setFilter({
        field: 'type',
        operator: CondOperator.IN,
        value: [AudienceType.CUSTOM_AUDIENCE, AudienceType.LOOKALIKE_AUDIENCE],
      })
      .setFilter({
        field: 'adAccount.id',
        operator: CondOperator.EQUALS,
        value: this.adAccount.id,
      })
      .resetCache();

    if (searchTerm) {
      queryBuild.setFilter([{ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm }]);
    }
    queryBuild.setLimit(AUDIENCE_PAGINATION_SIZE);
    queryBuild.setOffset(offset);
    queryBuild.sortBy({ field: 'name', order: 'ASC' });
    return queryBuild;
  }
}
