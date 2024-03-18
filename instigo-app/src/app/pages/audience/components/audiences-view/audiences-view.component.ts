import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { AudienceDto, AudienceSubType, AudienceType, TargetingTemplateDto } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { AudienceViewService } from '../../audience-view.service';
import { AudienceActionService } from '../../page/audience-actions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audiences-view',
  templateUrl: './audiences-view.component.html',
  styleUrls: ['./audiences-view.component.scss'],
})
export class AudiencesViewComponent implements OnInit {
  @Output() showAudienceDetails = new EventEmitter<AudienceDto>();

  public tableState: Observable<TableState>;
  public tableData: Observable<Array<any>>;
  public tableConfiguration: TableConfiguration;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  private searchTermTemplateAndSelect: TemplateRef<any>;

  constructor(
    private readonly audienceViewService: AudienceViewService,
    private readonly audienceActionService: AudienceActionService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.tableState = this.audienceViewService.audienceTableState.state$;
    this.tableData = this.audienceViewService.audiences$();
  }

  public onTableStateChange(state: Partial<TableState>): void {
    this.audienceViewService.audienceTableState.patchState(state);
  }

  public selectAudience(audience: any, tooltipClick?: boolean): void {
    if (!tooltipClick) {
      this.audienceViewService.audienceTableState.patchState({ selectedItems: [audience] });
    }
    this.showAudienceDetails.emit(audience);
  }

  public deleteAudiences(audiences: AudienceDto[]): void {
    return this.audienceActionService.deleteAudiences({ audiences });
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      tableId: `audiences_view_table`,
      selectable: true,
      searchable: true,
      columnsCustomizable: true,
      clientSide: false,
      pageSizeCanBeChanged: true,
      customActions: [],
      responsiveCol: {
        column: 3,
        maxWidth: 25,
      },
      quickActions: [
        {
          label: 'Edit',
          singleSelect: true,
          icon: 'far fa-edit',
          callback: ([item]) => {
            switch (item.type) {
              case AudienceType.SAVED_AUDIENCE:
                this.editSavedAudience(item);
                break;
              case AudienceType.CUSTOM_AUDIENCE: {
                if (item.subType === AudienceSubType.WEBSITE) {
                  this.editWebsiteAudience(item);
                  break;
                }
                if (item.subType === AudienceSubType.LIST) {
                  break;
                }
              }
            }
          },
        },
        {
          label: 'Delete',
          icon: 'far fa-trash',
          callback: (items) => this.deleteAudiences(items),
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
          width: 200,
        },
        {
          name: 'Size',
          prop: 'size',
          cellTemplate: this.templates.numberCell,
        },
        {
          name: 'Type',
          prop: 'type',
        },
        {
          name: 'Status',
          prop: 'availability',
          width: 80,
        },
        {
          name: 'Created',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
          width: 80,
        },
      ],
    };
  }

  private editSavedAudience(targeting: TargetingTemplateDto): void {
    void this.router.navigate([{ outlets: { dialog: ['audience-operation', 'savedAudience', targeting.id] } }]);
  }

  private editWebsiteAudience(targeting: TargetingTemplateDto): void {
    void this.router.navigate([{ outlets: { dialog: ['audience-operation', 'websiteAudience', targeting.id] } }]);
  }
}
