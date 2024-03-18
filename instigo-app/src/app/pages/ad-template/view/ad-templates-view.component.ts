import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { AdTemplateDTO } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { AdTemplateActionService } from '../page/ad-template-actions.service';
import { AdTemplatePageService } from '../page/ad-template-page.service';

@Component({
  selector: 'app-ad-templates-view',
  templateUrl: './ad-templates-view.component.html',
  styleUrls: ['./ad-templates-view.component.scss'],
})
export class AdTemplatesViewComponent implements OnInit {
  @ViewChild(DataTableTemplatesComponent, { static: true })
  public templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  public searchTermTemplateAndSelect: TemplateRef<any>;

  public tableConfiguration: TableConfiguration;
  public tableData$: Observable<any[]>;
  public tableState: Observable<TableState>;

  constructor(
    private readonly adTemplatePageService: AdTemplatePageService,
    private readonly adTemplateActionService: AdTemplateActionService,
  ) {}

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.tableData$ = this.adTemplatePageService.adTemplates$();
    this.tableState = this.adTemplatePageService.adTemplateTableState$;
  }

  public onTableStateChange(state: Partial<TableState>): void {
    this.adTemplatePageService.updateTableState(state);
  }

  public selectAdTemplate(items: any): void {
    this.adTemplatePageService.updateTableState({ selectedItems: [items] });
  }

  public editSingleAdTemplate(item: AdTemplateDTO): void {
    this.edit(item);
  }

  private deleteAdTemplates(adTemplates: AdTemplateDTO[]): void {
    this.adTemplateActionService.delete({ items: adTemplates });
  }

  private edit(item: AdTemplateDTO): void {
    this.adTemplateActionService.edit(item);
  }

  private duplicate(item: AdTemplateDTO): void {
    this.adTemplateActionService.duplicate(item);
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      tableId: `ad_template_table`,
      selectable: true,
      searchable: true,
      columnsCustomizable: true,
      clientSide: false,
      pageSizeCanBeChanged: true,
      customActions: [],
      responsiveCol: {
        column: 3,
        maxWidth: 15,
        hasIcon: true,
      },
      quickActions: [
        {
          label: 'Duplicate',
          singleSelect: true,
          icon: 'far fa-plus',
          callback: ([item]: AdTemplateDTO[]) => {
            this.duplicate(item);
          },
        },
        {
          label: 'Edit',
          singleSelect: true,
          icon: 'far fa-edit',
          callback: ([item]: AdTemplateDTO[]) => {
            this.edit(item);
          },
        },
        {
          label: 'Delete',
          icon: 'far fa-trash',
          callback: (items: AdTemplateDTO[]) => {
            this.deleteAdTemplates(items);
          },
        },
      ],
      columns: [
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.templates.cellProviderIcon,
          headerTemplate: this.templates.networkHeader,
          unhideable: true,
          frozenLeft: true,
          canAutoResize: false,
          width: 50,
        },
        {
          name: 'Name',
          prop: 'name',
          cellTemplate: this.searchTermTemplateAndSelect,
          unhideable: true,
          frozenLeft: true,
          canAutoResize: true,
          width: 400,
        },
        {
          name: 'Ad Template Type',
          prop: 'adTemplateType',
          width: 100,
        },
        {
          name: 'Thumbnail',
          prop: 'thumbnail',
          cellTemplate: this.templates.thumbnailTemplate,
          width: 100,
          sortable: false,
          canAutoResize: false,
        },
        {
          name: 'Created At',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
          width: 150,
        },
        {
          name: 'Updated At',
          prop: 'updatedAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
          width: 150,
        },
      ],
    };
  }
}
