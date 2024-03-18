import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AudienceDto, AudienceTrackerDto } from '@instigo-app/data-transfer-object';
import { remove } from 'lodash-es';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-custom-audience-selector',
  templateUrl: './custom-audience-selector.component.html',
  styleUrls: ['./custom-audience-selector.component.scss'],
})
export class CustomAudienceSelectorComponent implements OnInit {
  @Input() customAudienceFormControl: FormControl;
  @Input() includeOrExclude = 'include';
  @Input() shouldLoadMore: boolean;
  @Input() audienceList = new BehaviorSubject<AudienceDto[]>([]);
  @Output() updateAudiences: EventEmitter<AudienceDto[]>;
  @Output() loadMore: EventEmitter<void>;
  public sources: NzSelectOptionInterface[] = [];
  public source: AudienceDto | AudienceTrackerDto;
  public selectedAudience: AudienceDto = null;

  private searchTerm: string;
  private sourceSearch$ = new BehaviorSubject<string>('');

  constructor() {
    this.updateAudiences = new EventEmitter<AudienceDto[]>();
    this.loadMore = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.transformAudiences();
  }

  public onSearch(searchTerm: string): void {
    this.sourceSearch$.next(searchTerm);
  }

  public onSelectorOpened(): void {
    this.sourceSearch$.next(this.searchTerm);
  }

  public addCustomAudience({ providerId, name, subType }: AudienceDto): void {
    const audienceList = this.customAudienceFormControl.value;
    audienceList.push({ providerId, name, subType });
    this.customAudienceFormControl.setValue(audienceList);
  }

  public removeCustomAudience({ providerId }: AudienceDto) {
    const audienceList = this.customAudienceFormControl.value;
    remove(audienceList, (item: AudienceDto) => item.providerId === providerId);
    this.customAudienceFormControl.setValue(audienceList);
    this.updateAudiences.emit();
  }

  public compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value.providerId === o2.value.providerId : false);

  public onSourceChange(audience: AudienceDto): void {
    this.addCustomAudience(audience as any);
    this.updateAudiences.emit();
  }

  private transformAudiences(): void {
    this.sourceSearch$
      .pipe(
        debounceTime(500),
        mergeMap((term: string) => {
          this.searchTerm = term;
          if (term === '') {
            return this.audienceList;
          }
          return this.audienceList.pipe(map((item) => item.filter((item) => item.name.includes(term))));
        }),
        map((filteredList) =>
          filteredList.map((item) => ({
            label: item.name,
            value: item,
          })),
        ),
      )
      .subscribe((item) => {
        this.sources = item;
      });
  }
}
