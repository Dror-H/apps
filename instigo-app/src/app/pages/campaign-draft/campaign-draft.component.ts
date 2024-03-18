import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignDraftService } from '@app/pages/campaign-draft/campaign-draft.service';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { CampaignDraftDTO } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ingo-campaign-draft',
  templateUrl: './campaign-draft.component.html',
  providers: [CampaignDraftService],
})
export class CampaignDraftComponent implements OnInit {
  public tableState: Observable<TableState>;
  public tableData: Observable<any[]>;
  public tableConfiguration: TableConfiguration;
  public showNoDraft: boolean;
  public filters$: Observable<Partial<{ adAccounts: any[] }>>;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  private searchTermTemplateAndSelect: TemplateRef<any>;

  constructor(
    private campaignDraftService: CampaignDraftService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.filters$ = this.campaignDraftService.filters$;
    this.tableConfiguration = this.getTableConfiguration();
    this.tableState = this.campaignDraftService.campaignsDraftTableState$.asObservable();
    this.tableData = this.campaignDraftService.drafts$();

    this.route.queryParams.pipe(filter((params) => params.hasNoDraft)).subscribe((param) => {
      if (param) {
        this.showNoDraft = true;
      }
    });
  }

  public updateFilterState(value): void {
    this.campaignDraftService.updateFilters(value);
  }

  public onTableStateChange(state: Partial<TableState>): void {
    this.campaignDraftService.updateCampaignsDraftViewTableState(state);
  }

  public selectCampaign(campaign: any): void {
    void this.router.navigate([`/new-campaign/${campaign.provider}/${campaign.id}`]);
  }

  public duplicate(item: CampaignDraftDTO): void {
    this.campaignDraftService.duplicate(item);
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: false,
      rowIdentity: (row) => row.id,
      tableId: `campaigns_draft_view_table`,
      selectable: true,
      searchable: true,
      pageSizeCanBeChanged: true,
      clientSide: false,
      quickActions: [
        {
          label: 'Duplicate',
          singleSelect: true,
          icon: 'far fa-plus',
          callback: ([item]: CampaignDraftDTO[]) => {
            this.duplicate(item);
          },
        },
        {
          label: 'Select',
          icon: 'far fa-play',
          singleSelect: true,
          callback: (item) => {
            void this.router.navigate([`/new-campaign/${item[0].provider}/${item[0].id}`]);
          },
        },
        {
          label: 'Delete',
          icon: 'far fa-trash',
          callback: (items) => this.campaignDraftService.deleteDrafts(items),
        },
      ],
      columns: [
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.templates.cellProviderIcon,
          headerTemplate: this.templates.networkHeader,
          width: 10,
        },
        {
          name: 'Campaign name',
          prop: 'name',
          cellTemplate: this.searchTermTemplateAndSelect,
          width: 400,
        },
        {
          name: 'Ad Account',
          prop: 'adAccount.name',
          cellTemplate: this.templates.nameTemplate,
          unhideable: true,
          sortable: false,
        },
        {
          name: 'Created',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
        },
      ],
    };
  }
}
