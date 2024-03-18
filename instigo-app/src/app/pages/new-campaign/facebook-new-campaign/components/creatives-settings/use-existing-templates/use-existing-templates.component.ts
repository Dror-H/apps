import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdTemplateApiService } from '@app/api/services/ad-template.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { fbCtaByObjective } from '@app/global/utils';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { TableState } from '@app/shared/data-table/data-table.model';
import {
  AdAccountDTO,
  AdTemplateDTO,
  AdTemplateType,
  NotificationType,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';
import { camelCase, startCase } from 'lodash-es';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { adPlacementsOptions, adTemplatesTableColumns } from '../../../facebook-new-campaign.data';
import { FacebookAdTemplateGeneratorService } from '../../../services/facebook-ad-template-generator.service';
import { ExistingTemplatePreviewComponent } from './existing-template-preview/existing-template-preview.component';
import { UseExistingTemplateService } from './use-existing-template.service';

export interface AdTemplatesTableItem {
  id: string;
  name: string;
  adTemplateType: string;
  created: string;
  updated: string;
  preview: string;
  checked: boolean;
}

@Component({
  selector: 'ingo-use-existing-templates',
  templateUrl: './use-existing-templates.component.html',
  styleUrls: ['./use-existing-templates.component.scss'],
})
export class UseExistingTemplatesComponent implements OnInit, OnDestroy {
  @Input() campaignCreatives = new FormGroup({});

  @ViewChild('templatesTable')
  nzTableComponent?: NzTableComponent<AdTemplatesTableItem>;

  @ViewChild('changeCtaModalContent')
  changeCtaModalContent: TemplateRef<any>;

  public newCtaValue: string;
  public adTemplatesData$: Observable<AdTemplateDTO[]> = null;
  public isSearchOpen = false;
  public columns: any[];
  public isListView = true;
  public adPlacementsOptions = adPlacementsOptions;
  public adTemplateTableState$ = new BehaviorSubject(new TableState());
  public adTemplateFormsMap = new Map<string, FormGroup>();
  private selectedTemplate$ = new BehaviorSubject<string[]>([]);
  private subSink = new SubSink();

  constructor(
    public readonly useExistingTemplateService: UseExistingTemplateService,
    private readonly fb: FormBuilder,
    private readonly modalService: NzModalService,
    private readonly store: Store,
    private readonly displayNotification: DisplayNotification,
    private adTemplateApiService: AdTemplateApiService,
    private adTemplateGeneratorService: FacebookAdTemplateGeneratorService,
  ) {}

  public get adCombinations(): FormControl {
    return this.campaignCreatives.get('existingTemplate.adCombinations') as FormControl;
  }

  public get selectedCampaignObjectiveValue(): string {
    return this.campaignCreatives.parent.get('settings.objective')?.value;
  }

  private get adSetFormat(): FormControl {
    return this.campaignCreatives.parent.get('adSetFormat') as FormControl;
  }

  private get adAccountValue(): AdAccountDTO {
    return this.campaignCreatives.parent.get('settings.account').value as AdAccountDTO;
  }

  ngOnInit(): void {
    this.columns = adTemplatesTableColumns;
    this.adTemplateTableState$ = this.useExistingTemplateService.adTemplateTableState$;
    this.useExistingTemplateService.adAccount$.next(this.adAccountValue);
    this.selectedTemplate$.next(this.adCombinations.value.map((item) => item.id));
    this.adTemplatesData$ = this.setSelectedAdTemplates();
    this.buildAdTemplateFormsMap();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public searchTable(searchTerm: string): void {
    this.useExistingTemplateService.updateTableState({ page: 1, searchTerm });
  }

  public onPageChange(page): void {
    this.useExistingTemplateService.updateTableState({ page });
  }

  public toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  public toggleView(view: string): void {
    this.isListView = view === 'list';
  }

  public selectAdTemplate(adTemplate: AdTemplateDTO): void {
    const callToAction = adTemplate.data['callToAction'];
    if (
      this.adAccountValue.provider === SupportedProviders.FACEBOOK &&
      callToAction &&
      callToAction !== 'NO_BUTTON' &&
      !fbCtaByObjective[this.selectedCampaignObjectiveValue].includes(callToAction)
    ) {
      const currentCallToAction = startCase(camelCase(callToAction));
      const selectedCampObjective = startCase(camelCase(this.selectedCampaignObjectiveValue));
      const validCallToActionOptions = fbCtaByObjective[this.selectedCampaignObjectiveValue].map((item) => ({
        value: item,
        label: startCase(camelCase(item)),
      }));
      this.modalService.create({
        nzTitle: 'Incompatible Call to Action',
        nzContent: this.changeCtaModalContent,
        nzClosable: false,
        nzComponentParams: {
          currentCallToAction,
          selectedCampObjective,
          validCallToActionOptions,
        },
        nzOkText: 'Update Call to Action',
        nzCancelText: 'Cancel',
        nzOnOk: () => {
          const workspaceId = this.store.selectSnapshot(WorkspaceState.workspaceId);
          const payload = {
            name: adTemplate.name,
            adTemplateType: adTemplate.adTemplateType,
            data: { ...adTemplate.data, callToAction: this.newCtaValue },
            provider: adTemplate.provider,
            adAccount: adTemplate.adAccount,
            workspace: { id: workspaceId },
          } as any;
          adTemplate.data = { ...payload };
          return this.adTemplateApiService
            .update({ id: adTemplate.id, payload })
            .pipe(take(1))
            .subscribe(() => {
              this.displayNotification.displayNotification(
                new Notification({
                  title: `Call to Action has been updated`,
                  type: NotificationType.SUCCESS,
                }),
              );
              this.newCtaValue = null;
              this.updateSelectedAdTemplates(adTemplate.id);
            });
        },
        nzOnCancel: () => {},
      });
    } else {
      this.updateSelectedAdTemplates(adTemplate.id);
    }
  }

  public updateSelectedAdTemplates(id: string): void {
    const selectedIds = this.addOrRemoveSelectedId(id, this.selectedTemplate$.value);
    this.setSelectedAdTemplatesInForm(selectedIds);
    this.selectedTemplate$.next(selectedIds);
  }

  public openPreview(adTemplate: AdTemplateDTO, $event) {
    $event.stopPropagation();
    this.modalService.create({
      nzTitle: `Use ${adTemplate.name}`,
      nzContent: ExistingTemplatePreviewComponent,
      nzComponentParams: {
        existingAdTemplateForm: this.adTemplateFormsMap.get(adTemplate.id),
        adSetFormat: this.adSetFormat,
      },
      nzWidth: 1120,
    });
  }

  private setSelectedAdTemplates(): Observable<AdTemplateDTO[]> {
    return combineLatest([this.useExistingTemplateService.adTemplates$(), this.selectedTemplate$]).pipe(
      map(([adTemplates, selectedTemplateIds]) =>
        adTemplates.map((template) => {
          template.checked = selectedTemplateIds.indexOf(template.id) > -1;
          template.checked =
            this.adCombinations.value.map((adTemplateForm: any) => adTemplateForm.id).indexOf(template.id) > -1
              ? true
              : template.checked;
          return template;
        }),
      ),
    );
  }

  private buildAdTemplateFormsMap() {
    this.subSink.sink = this.adTemplatesData$.subscribe((adTemplates) =>
      adTemplates.forEach((adTemplate) =>
        this.adTemplateFormsMap.set(adTemplate.id, this.createAdTemplateForm(adTemplate)),
      ),
    );
  }

  private createAdTemplateForm(adTemplate: AdTemplateDTO): FormGroup {
    switch (adTemplate.adTemplateType) {
      case AdTemplateType.IMAGE: {
        return this.adTemplateGeneratorService.generateImageAdTemplate(adTemplate);
      }
      case AdTemplateType.VIDEO: {
        return this.adTemplateGeneratorService.generateVideoAdTemplate(adTemplate);
      }
      case AdTemplateType.CAROUSEL: {
        return this.adTemplateGeneratorService.generateCarouselAdTemplate(adTemplate);
      }
    }
    return null;
  }

  private addOrRemoveSelectedId(id: string, selectedTemplateIds: string[]): string[] {
    const selectedAdTemplates: string[] = [...selectedTemplateIds];
    const index = selectedAdTemplates.indexOf(id);
    if (index > -1) {
      selectedAdTemplates.splice(index, 1);
    } else {
      selectedAdTemplates.push(id);
    }
    return selectedAdTemplates;
  }

  private setSelectedAdTemplatesInForm(selectedTemplateIds: string[]) {
    this.adCombinations.setValue(selectedTemplateIds.map((id) => this.adTemplateFormsMap.get(id).value));
  }
}
