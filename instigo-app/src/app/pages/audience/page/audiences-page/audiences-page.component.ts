import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableState } from '@app/shared/data-table/data-table.model';
import { AudienceDto, TargetingTemplateDto } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AudienceViewService } from '../../audience-view.service';

@Component({
  selector: 'app-audiences-page-component',
  templateUrl: './audiences-page.component.html',
  styleUrls: ['./audiences-page.component.scss'],
})
export class AudiencesPageComponent implements OnInit, OnDestroy {
  public activeTab = 0;
  public sideBarOpened = false;
  public sideBarContent: AudienceDto | TargetingTemplateDto;
  public sideBarType: 'audience' | 'targetingTemplate';
  public selectedAudiencesLength$: Observable<number>;
  public selectedTargetingsLength$: Observable<number>;
  public filters$: Observable<any>;

  constructor(private readonly audienceViewService: AudienceViewService) {}

  ngOnInit() {
    this.selectedAudiencesLength$ = this.audienceViewService.audienceTableState.state$.pipe(
      map((state) => state.selectedItems.length),
    );
    this.selectedTargetingsLength$ = this.audienceViewService.targetingTableState.state$.pipe(
      map((state) => state.selectedItems.length),
    );
    this.filters$ = this.audienceViewService.filters.state$;
  }

  ngOnDestroy() {
    this.audienceViewService.audienceTableState.setState(new TableState());
  }

  deselectAudiences(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.audienceViewService.audienceTableState.patchState({ allRowsSelected: false, selectedItems: [] });
  }

  deselectTargetings(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.audienceViewService.targetingTableState.patchState({ allRowsSelected: false, selectedItems: [] });
  }

  updateFilterState(value: Partial<any>) {
    this.audienceViewService.filters.patchState(value);
  }

  toggleSideBar(instance: AudienceDto | TargetingTemplateDto, type: 'audience' | 'targetingTemplate') {
    if (!this.sideBarOpened || this.sideBarContent?.id === instance.id) {
      this.sideBarOpened = !this.sideBarOpened;
    }
    this.sideBarContent = instance;
    this.sideBarType = type;
  }

  public closeSideBar() {
    this.sideBarOpened = false;
  }
}
