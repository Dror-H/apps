import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@audience-app/global/models/app.models';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { AudienceActions } from '@audience-app/pages/audience-search-page/audience-actions.type';
import { ActionBoxClickEvents } from '@audience-app/shared/components/action-box/action-box.models';
import { ActionButtonConfig } from '@audience-app/shared/components/action-buttons/action-buttons.models';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { LoadingState } from '@audience-app/store/loading.state';
import { UserState } from '@audience-app/store/user.state';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-audience-search-page',
  templateUrl: './audience-search-page.component.html',
  styleUrls: ['./audience-search-page.component.scss'],
})
export class AudienceSearchPageComponent implements OnInit {
  @Select(LoadingState.getIsLoadingAudiences) isLoadingAudiences$: Observable<boolean>;
  @Select(LoadingState.getIsLoadingMergedAudience) isLoadingMergedAudience$: Observable<boolean>;
  @Select(UserState.getUserAndAdAccounts) user$: Observable<User>;
  @Select(AudiencesState.getFoundAudiences) foundAudiences$: Observable<SearchResult[]>;
  @Select(AudiencesState.getSelectedAudiences) selectedAudiences$: Observable<SearchResult[]>;

  public actionButtons: ActionButtonConfig<AudienceActions>[] = [
    { label: 'Recommended', action: 'SEE_RECOMMENDED', active: true },
    { label: 'Load Saved Audience', action: 'LOAD_SAVED_AUDIENCES', active: false },
    { label: 'Create New Audience', action: 'CREATE_NEW_AUDIENCE', active: false },
  ];

  constructor(private router: Router, private audiencesService: AudiencesService) {}

  ngOnInit(): void {
    this.audiencesService.resetSelectedAudiences();
    this.audiencesService.resetFoundAudiences();
  }

  public onActionBoxClickEvent(eventValue: ActionBoxClickEvents): void {
    switch (eventValue) {
      case 'clear':
        this.audiencesService.setSelectedAudiences.emit([]);
        break;
      case 'next':
        void this.router.navigateByUrl('audience-edit');
        break;
      default:
        throw new Error('Action box event type not supported');
    }
  }

  public onActionButtonClickEvent(action: AudienceActions): void {
    switch (action) {
      case 'SEE_RECOMMENDED':
        break;
      case 'LOAD_SAVED_AUDIENCES':
        void this.router.navigateByUrl('audience-edit');
        break;
      case 'CREATE_NEW_AUDIENCE':
        void this.router.navigateByUrl('audience-edit');
        break;
      default:
        throw new Error('Action button event type not supported');
    }
  }
}
