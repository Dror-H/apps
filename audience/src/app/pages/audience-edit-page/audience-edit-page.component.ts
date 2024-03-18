import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@audience-app/global/models/app.models';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import {
  createFacebookExportUrl,
  createRulesFromTargeting,
  getAudiencesFlatValues,
} from '@audience-app/pages/audience-edit-page/utils';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { LoadingState } from '@audience-app/store/loading.state';
import { UserState } from '@audience-app/store/user.state';
import {
  AdAccountDTO,
  AdSetDTO,
  AudienceType,
  CampaignDTO,
  SearchResult,
  SupportedProviders,
  TargetingDto,
  UserTargetings,
} from '@instigo-app/data-transfer-object';
import { getProcessedValues, SelectTagsConfig, STORE } from '@instigo-app/ui/shared';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { debounceTime, retry, skip, skipWhile, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'audi-audience-edit-page',
  templateUrl: './audience-edit-page.component.html',
  styleUrls: ['./audience-edit-page.component.scss'],
})
export class AudienceEditPageComponent implements OnInit, OnDestroy {
  @SelectSnapshot(AudiencesState.getSelectedAudiences) public selectedAudiences: SearchResult[];
  @Select(LoadingState.getIsSavingAudience) public isSavingAudience$: Observable<boolean>;

  public rules: TargetingDto;
  public audienceForm = new FormGroup({});
  public isOverviewActive = false;
  public saveAudience$ = new BehaviorSubject<AdAccountDTO>(null);
  public isAudienceSaved = false;
  public isAudienceExported = false;
  public selectTagsConfig: SelectTagsConfig;
  public user: User;

  private subscriptions = new SubSink();

  constructor(
    @Inject(STORE) private store: Store,
    private fb: FormBuilder,
    private _location: Location,
    private _router: Router,
    private audiencesService: AudiencesService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.initAudienceForm();
    this.subscribeToChangeAdAccount();
    this.subscribeToSaveAudience();
    this.enableSaveOnValueChange();
    this.handleMergedAudienceFromRouteData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public goBack(): void {
    if (this.isAudienceSaved) {
      void this._router.navigateByUrl('/');
      return;
    }

    const locationState = this._location.getState();
    const isFirstAppNavigation = (locationState as { navigationId: number }).navigationId === 1;
    isFirstAppNavigation ? void this._router.navigateByUrl('/') : this._location.back();
  }

  public toggleOverview(toggleState: boolean): void {
    this.isOverviewActive = toggleState;
  }

  public triggerSaveAudience(): void {
    this.saveAudience$.next(null);
  }

  public triggerExportAudience(): void {
    this.modalService.openAdAccountSelectorModal(this.rules).afterClose.subscribe((adAccount) => {
      if (adAccount) {
        this.saveAudience$.next(adAccount);
      }
    });
  }

  private subscribeToSaveAudience(): void {
    this.subscriptions.add(
      this.saveAudience$
        .pipe(
          skip(1),
          debounceTime(300),
          skipWhile(() => this.isAudienceSaved),
          switchMap((value) => {
            this.loadingService.isSavingAudience.emit(true);
            if (!value) {
              return this.saveAudience();
            }
            return this.exportAudience$(value);
          }),
          this.cleanupAfterSaveAudience(),
          retry(), //* prevent observable complete
        )
        .subscribe(),
    );
  }

  private cleanupAfterSaveAudience(): MonoTypeOperatorFunction<unknown> {
    return tap({
      next: () => {
        this.isAudienceSaved = true;
        this.audiencesService.resetSelectedAudiences();
        this.audiencesService.setFoundAudiences.emit(null);
        this.loadingService.isSavingAudience.emit(false);
      },
      error: () => {
        this.loadingService.isSavingAudience.emit(false);
      },
    });
  }

  private exportAudience$(value: AdAccountDTO): Observable<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }> {
    return this.exportAudience(value).pipe(
      tap((result) => {
        this.modalService.openOnOK(
          createFacebookExportUrl(value.id, result.campaign.providerId, result.adSet.providerId),
        );
      }),
    );
  }

  private handleMergedAudienceFromRouteData(): void {
    const mergedAudience: SearchResult[] = this.route.snapshot.data[0];
    this.handleMergedAudience(mergedAudience);
  }

  private handleMergedAudience(mergedAudienceArr: SearchResult[]): void {
    this.setAudienceRules(mergedAudienceArr[0]?.spec as TargetingDto);
    this.setUserTags(mergedAudienceArr);
    this.setSelectTagsConfig();
  }

  private setAudienceRules(mergedAudience: TargetingDto): void {
    this.rules = createRulesFromTargeting(mergedAudience);
  }

  private setUserTags(selectedAudiences: SearchResult[]): void {
    const tags = getProcessedValues(getAudiencesFlatValues(selectedAudiences, 'userTags'), 65);
    this.audienceForm.get('userTags').setValue(tags);
  }

  private enableSaveOnValueChange(): void {
    this.subscriptions.add(
      this.audienceForm.valueChanges
        .pipe(
          tap((val) => {
            this.isAudienceSaved = false;
            this.isAudienceExported = false;
          }),
        )
        .subscribe(),
    );
  }

  private setSelectTagsConfig(): void {
    this.selectTagsConfig = {
      disabled: false,
      tagSuggestions: getProcessedValues(getAudiencesFlatValues(this.selectedAudiences, 'topics'), 150),
    };
  }

  private saveAudience(): Observable<UserTargetings> {
    return this.audiencesService.saveAudience(this.getAudienceValues());
  }

  private exportAudience(adAccount: AdAccountDTO): Observable<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }> {
    return this.audiencesService.exportAudience({ ...this.getAudienceValues(), adAccount }).pipe(
      tap(() => {
        this.isAudienceExported = true;
      }),
    );
  }

  private getAudienceValues(): {
    name: string;
    targeting: TargetingDto;
    userTags: string[];
  } {
    const provider = this.audienceForm.get('provider').value;
    const name = this.audienceForm.get('name').value;
    const { include, exclude } = this.audienceForm.get('target').value as TargetingDto;
    const targeting: TargetingDto = { provider, include, exclude };
    const userTags: string[] = this.audienceForm.get('userTags').value;
    return { name, targeting, userTags };
  }

  private initAudienceForm(): void {
    this.audienceForm = this.fb.group({
      audienceType: [AudienceType.SAVED_AUDIENCE],
      audienceSubType: [null, []],
      adAccount: ['', [Validators.required]],
      provider: [SupportedProviders.FACEBOOK],
      description: [''],
      name: ['', [Validators.minLength(4), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      reach: ['', [Validators.required]],
      target: [],
      userTags: [],
    });
  }

  private subscribeToChangeAdAccount(): void {
    this.subscriptions.add(
      this.store.select(UserState).subscribe((user) => {
        if (user?.adAccounts?.length) {
          this.audienceForm.get('adAccount').setValue({ providerId: user.adAccounts[0].id });
          this.user = user;
        }
      }),
    );
  }
}
