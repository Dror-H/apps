import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { SubSink } from 'subsink';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { AdAccountDTO, CampaignGroupDTO } from '@instigo-app/data-transfer-object';
import { startWith, switchMap } from 'rxjs/operators';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { CampaignGroupsApiService } from '@app/api/services/campaign-groups.api.service';

@Component({
  selector: 'ingo-campaign-groups-selector',
  templateUrl: 'campaign-groups-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampaignGroupsSelectorComponent),
      multi: true,
    },
  ],
})
export class CampaignGroupsSelectorComponent extends ControlValueAccessorBaseHelper implements OnInit {
  @Input() adAccount: FormControl;
  @Input() formControl: FormControl;

  public campaignGroupList$ = new BehaviorSubject<NzSelectOptionInterface[]>([]);
  private subSink = new SubSink();

  constructor(private campaignGroupService: CampaignGroupsApiService) {
    super();
  }

  public compareCampaignsGroups = (o1: any, o2: any) => (o1 && o2 ? o1.providerId === o2.providerId : o1 === o2);

  ngOnInit(): void {
    this.subSink.sink = this.adAccount.valueChanges
      .pipe(
        startWith(this.adAccount.value),
        switchMap((adAccount) => {
          if (adAccount) {
            return this.findAllCampaignGroups(adAccount);
          } else {
            return of(null);
          }
        }),
      )
      .subscribe((campaignGroup: CampaignGroupDTO[]) => {
        if (campaignGroup != null) {
          this.campaignGroupList$.next(campaignGroup.map((group) => ({ value: group, label: group.name })));
        }
      });
  }

  private findAllCampaignGroups(adAccount: AdAccountDTO): Observable<CampaignGroupDTO[]> {
    return this.campaignGroupService.findAll(this.buildCampaignGroupsQuery(adAccount));
  }

  private buildCampaignGroupsQuery(adAccount: AdAccountDTO): string {
    const query = RequestQueryBuilder.create();
    query.sortBy({ field: 'updatedAt', order: 'DESC' }).setFilter({
      field: 'adAccount.id',
      operator: CondOperator.EQUALS,
      value: adAccount.id,
    });
    return query.query();
  }
}
