import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import { AdAccountDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { AUDIENCE_PAGINATION_SIZE } from '@app/global/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';

@Component({
  selector: 'ingo-linkedin-targeting-selector',
  templateUrl: './linkedin-targeting-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LinkedinTargetingSelectorComponent),
      multi: true,
    },
  ],
})
export class LinkedinTargetingSelectorComponent extends ControlValueAccessorBaseHelper implements OnInit, OnDestroy {
  @Input() adAccount: AdAccountDTO;
  public loadMoreAudiences$ = new BehaviorSubject(0);
  public searchTerm$ = new BehaviorSubject('');
  public shouldLoadMore = false;
  public audiences: NzSelectOptionInterface[] = [];

  private subSink = new SubSink();

  constructor(private readonly audienceApiService: AudienceApiService) {
    super();
  }

  public onSearch(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }

  public loadMoreCustomAudiences() {
    const previousValue = this.loadMoreAudiences$.value;
    this.loadMoreAudiences$.next(previousValue + AUDIENCE_PAGINATION_SIZE);
  }

  ngOnInit(): void {
    this.loadMoreAudiences$
      .pipe(
        switchMap((offset) =>
          this.searchTerm$.pipe(
            debounceTime(200),
            map((searchTerm) => ({ offset, searchTerm })),
          ),
        ),
        switchMap(({ offset, searchTerm }) =>
          this.findAllLinkedinAudiences(offset, searchTerm).pipe(map((items) => ({ offset, items: items }))),
        ),
        tap(({ offset, items }) => (this.shouldLoadMore = offset + AUDIENCE_PAGINATION_SIZE < items.total)),
        map(({ items }) => items.data.map((audience) => ({ label: audience.name, value: audience.providerId }))),
      )
      .subscribe((audiences) => {
        this.audiences = audiences;
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public onSelectAudience(audience): void {
    this.onChanged(audience);
  }

  private findAllLinkedinAudiences(offset: number, searchTerm: string): Observable<any> {
    return this.audienceApiService.findAll(this.buildAudienceQuery(offset, searchTerm).query());
  }

  private buildAudienceQuery(offset = 0, searchTerm?: string): RequestQueryBuilder {
    const qb = RequestQueryBuilder.create();
    const queryBuild = qb
      .setFilter({ field: 'provider', operator: CondOperator.EQUALS, value: SupportedProviders.LINKEDIN })
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
