import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { providerSquareIcons } from '@app/global/constants';
import { convertAudienceLookalikeSpecToHtml } from '@app/shared/shared/convert-audience-lookalike-to-html';
import { convertAudienceRulesToTextTable } from '@app/shared/shared/convert-audience-rules-to-text';
import { convertTargetingOrList } from '@app/shared/shared/convert-targeting-to-html';
import {
  AudienceDto,
  AudienceRulesDto,
  AudienceSubType,
  AudienceType,
  TargetingDto,
  TargetingExcludeDto,
  TargetingTemplateDto,
} from '@instigo-app/data-transfer-object';
import { isEmpty } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-audience-details',
  templateUrl: './audience-details.component.html',
})
export class AudienceDetailsComponent implements OnChanges {
  @Input()
  opened = false;

  @Input()
  instance: AudienceDto | TargetingTemplateDto;

  @Input()
  type: 'audience' | 'targetingTemplate';

  public AudienceType = AudienceType;
  public AudienceSubType = AudienceSubType;
  public icon: string;
  public audienceRules: { include$: Observable<string>; exclude$?: Observable<string> } = {} as any;
  public audienceLookalikes$: Observable<string>;
  public audienceLookalikeSpec$: Observable<string>;
  public targetingRules: { include$: Observable<string>; exclude$?: Observable<string> } = {} as any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.instance) {
      const { currentValue, previousValue }: SimpleChange = changes.instance;
      if (currentValue?.id && currentValue.id !== previousValue?.id) {
        this.setInstanceIcon();
        this.setInstanceSpec();
      }
    }
  }

  public targetingRuleExcludeIsEmpty(exclude: TargetingExcludeDto): boolean {
    return isEmpty(exclude?.or);
  }

  private extractLookalikesUsingAudience$(instance: AudienceDto): Observable<string> {
    return of(instance).pipe(
      filter((audience) => audience.hasOwnProperty('lookalikeAudiences')),
      debounceTime(500),
      map(({ lookalikeAudiences }) => {
        if (!lookalikeAudiences || !lookalikeAudiences.length) {
          return '';
        }
        const sentence = `${lookalikeAudiences.length} Lookalike created from this audience\r\n`;
        return lookalikeAudiences.reduce((acc, audience) => `${acc} \t${audience.name}\r\n`, sentence);
      }),
    );
  }

  private convertAudienceLookalikeSpecToText$(instance: AudienceDto): Observable<string> {
    return of(instance).pipe(
      filter(
        (audience) =>
          audience.hasOwnProperty('lookalikeSpec') && audience.lookalikeSpec?.hasOwnProperty('originAudience'),
      ),
      map(({ lookalikeSpec }) => convertAudienceLookalikeSpecToHtml(lookalikeSpec)),
    );
  }

  private convertTargetingRulesToHtml$(
    instance: TargetingTemplateDto | AudienceDto,
    scope: 'include' | 'exclude',
  ): Observable<string> {
    return of(instance).pipe(
      filter(
        (template) =>
          template.hasOwnProperty('rules') &&
          ((<TargetingDto | AudienceRulesDto>template.rules)?.and?.hasOwnProperty(scope) ||
            template.rules.hasOwnProperty(scope)),
      ),
      debounceTime(500),
      map((template) => {
        const { rules: targeting } = template;
        const { include, exclude } = targeting as TargetingDto;
        let innerHTML = '';
        if (scope === 'include') {
          innerHTML += include.and.reduce((acc: string, { or }) => (acc += convertTargetingOrList(or)), ``);
        } else if (scope === 'exclude' && !this.targetingRuleExcludeIsEmpty(exclude)) {
          innerHTML += convertTargetingOrList(exclude.or);
        }
        return innerHTML;
      }),
    );
  }

  private setInstanceIcon(): void {
    this.icon = providerSquareIcons[this.instance.provider];
  }

  private setInstanceSpec(): void {
    if (this.type === 'targetingTemplate' || this.instance.type === AudienceType.SAVED_AUDIENCE) {
      const template = this.instance as TargetingTemplateDto;
      this.audienceRules = { include$: of('') };
      this.audienceLookalikeSpec$ = of('');
      this.audienceLookalikes$ = of('');
      this.targetingRules = {
        include$: this.convertTargetingRulesToHtml$(template, 'include'),
        exclude$: this.convertTargetingRulesToHtml$(template, 'exclude'),
      };
      return;
    }
    if (this.type === 'audience') {
      const audience = this.instance as AudienceDto;
      this.targetingRules = { include$: of('') };
      if (audience.type === AudienceType.LOOKALIKE_AUDIENCE) {
        this.audienceRules = { include$: of('') };
        this.audienceLookalikes$ = of('');
        this.audienceLookalikeSpec$ = this.convertAudienceLookalikeSpecToText$(audience);
      } else if (audience.type === AudienceType.CUSTOM_AUDIENCE) {
        this.audienceLookalikeSpec$ = of('');
        this.audienceRules = {
          include$: this.convertAudienceRulesToText$(audience, 'include'),
          exclude$: this.convertAudienceRulesToText$(audience, 'exclude'),
        };
        this.audienceLookalikes$ = this.extractLookalikesUsingAudience$(audience);
      }
    }
  }

  private convertAudienceRulesToText$(instance: AudienceDto, scope: 'include' | 'exclude'): Observable<string> {
    return of(instance).pipe(
      filter((audience) => audience.hasOwnProperty('rules') && audience.rules.hasOwnProperty(scope)),
      map(({ rules }) => convertAudienceRulesToTextTable(rules[scope])),
    );
  }
}
