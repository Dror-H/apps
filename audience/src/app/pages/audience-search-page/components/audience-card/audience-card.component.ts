import { Component, Input, OnInit } from '@angular/core';
import {
  AudienceDetailsDrawerState,
  AudienceDetailsDrawerStateModel,
} from '@audience-app/store/audience-details-drawer.state';
import { SearchResult, TargetingConditionDto, TargetingDto, TARGETING_TYPES } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { flatten } from 'lodash';

@Component({
  selector: 'audi-audience-card',
  templateUrl: './audience-card.component.html',
  styleUrls: ['./audience-card.component.scss'],
})
export class AudienceCardComponent implements OnInit {
  @Emitter(AudienceDetailsDrawerState.set) drawerStateEmitter: Emittable<AudienceDetailsDrawerStateModel>;
  @Input() public audience: SearchResult;

  public targetingTypes = TARGETING_TYPES;
  public includedTargeting: TargetingConditionDto[][];
  public excludedTargeting: TargetingConditionDto[];

  ngOnInit(): void {
    if (this.audience) {
      this.getIncludedTargeting();
      this.getExcludedTargeting();
    }
  }

  public openDrawer(ev: Event): void {
    ev.stopPropagation();
    this.drawerStateEmitter.emit({
      isVisible: true,
      data: {
        inclusions: this.includedTargeting,
        exclusions: this.excludedTargeting,
        rank: this.audience.rank,
        specRatio: this.audience.specRatio,
        userTags: this.audience.userTags,
      },
    });
  }

  private getIncludedTargeting(): void {
    if (this.audience) {
      const includes = (this.audience.spec as TargetingDto).include.and;
      const includedTargeting = includes.reduce((a, c, i) => {
        if (i > 1) {
          a.push(flatten(Object.values(c.or)));
        }
        return a;
      }, []);
      this.includedTargeting = includedTargeting;
    }
  }
  private getExcludedTargeting(): void {
    if (this.audience) {
      const excludes = (this.audience.spec as TargetingDto).exclude.or;
      let excludedTargeting: TargetingConditionDto[] = [];
      const excludesKeys = Object.keys(excludes);
      for (const key of excludesKeys) {
        excludedTargeting = [...excludedTargeting, ...excludes[key]];
      }
      this.excludedTargeting = excludedTargeting;
    }
  }
}
