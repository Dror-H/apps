import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { TargetingDto, TargetingTemplateDto } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { AudienceViewService } from '../../audience-view.service';
import { AudienceActionService } from '../../page/audience-actions.service';

@Component({
  selector: 'app-targetings-view',
  templateUrl: './targetings-view.component.html',
  styleUrls: ['./targetings-view.component.scss'],
})
export class TargetingsViewComponent implements OnInit {
  @Output()
  showTargetingDetails = new EventEmitter<TargetingTemplateDto>();

  public tableState: Observable<TableState>;

  public tableData: Observable<Array<any>>;
  public tableConfiguration: TableConfiguration;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  private searchTermTemplateAndSelect: TemplateRef<any>;

  constructor(
    private readonly router: Router,
    private readonly audienceViewService: AudienceViewService,
    private readonly audienceActionService: AudienceActionService,
  ) {}

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.tableState = this.audienceViewService.targetingTableState.state$;
    this.tableData = this.audienceViewService.targeting$();
  }

  public onTableStateChange(state: Partial<TableState>) {
    this.audienceViewService.targetingTableState.patchState(state);
  }

  public selectTargeting(targeting: TargetingTemplateDto) {
    this.audienceViewService.targetingTableState.patchState({ selectedItems: [targeting] });
    this.showTargetingDetails.emit(targeting);
  }

  private deleteTargetings(targetings: TargetingTemplateDto[]): void {
    this.audienceActionService.deleteTargetings({ targetings });
  }

  private editTargeting(targetings: TargetingTemplateDto): void {
    this.router.navigate([{ outlets: { dialog: ['audience-operation', 'targeting', targetings.id] } }]);
  }

  private duplicate(item: any): void {
    this.audienceActionService.duplicateTargeting(item);
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: false,
      rowIdentity: (row) => row.id,
      tableId: `targetings_view_table`,
      selectable: true,
      searchable: true,
      columnsCustomizable: true,
      pageSizeCanBeChanged: true,
      clientSide: false,
      customActions: [],
      responsiveCol: {
        column: 3,
        maxWidth: 25,
      },
      quickActions: [
        {
          label: 'Duplicate',
          singleSelect: true,
          icon: 'far fa-plus',
          callback: ([item]: TargetingDto[]) => {
            this.duplicate(item);
          },
        },
        {
          label: 'Edit',
          singleSelect: true,
          icon: 'far fa-edit',
          callback: ([item]) => {
            this.editTargeting(item);
          },
        },
        {
          label: 'Delete',
          icon: 'far fa-trash',
          callback: (items) => this.deleteTargetings(items),
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
          width: 300,
        },
        {
          name: 'Size',
          prop: 'size',
          width: 150,
          sortable: true,
          cellTemplate: this.templates.numberCell,
        },
        {
          name: 'Type',
          prop: 'type',
          width: 150,
          sortable: true,
        },
        {
          name: 'Created',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
          width: 150,
        },
      ],
    };
  }
}
