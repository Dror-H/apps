import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CampaignStatusIcons, providerColors, providerSquareIcons } from '@app/global/constants';
import { CampaignStatusType } from '@instigo-app/data-transfer-object';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { DataTableColumnEditModalComponent } from '../components/data-table-column-edit.component';

@Component({
  selector: 'app-data-table-templates',
  templateUrl: './data-table-templates.component.html',
  styleUrls: ['./data-table-templates.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableTemplatesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('networkHeader', { static: true })
  networkHeader: TemplateRef<any>;

  @ViewChild('cellProviderIcon', { static: true })
  cellProviderIcon: TemplateRef<any>;

  @ViewChild('thumbnailTemplate', { static: true })
  thumbnailTemplate: TemplateRef<any>;

  @ViewChild('facebookPreviewTemplate', { static: true })
  facebookPreviewTemplate: TemplateRef<any>;

  @ViewChild('nameTemplate', { static: true })
  nameTemplate: TemplateRef<any>;

  @ViewChild('searchTermTemplate', { static: true })
  searchTermTemplate: TemplateRef<any>;

  @ViewChild('campaignStatus', { static: true })
  campaignStatus: TemplateRef<any>;

  @ViewChild('campaignBudgetTemplate', { static: true })
  campaignBudgetTemplate: TemplateRef<any>;

  @ViewChild('adSetBudgetTemplate', { static: true })
  adSetBudgetTemplate: TemplateRef<any>;

  @ViewChild('currencyCell', { static: true })
  currencyCell: TemplateRef<any>;

  @ViewChild('dateCell', { static: true })
  dateCell: TemplateRef<any>;

  @ViewChild('percentageCell', { static: true })
  percentageCell: TemplateRef<any>;

  @ViewChild('clicksTemplate', { static: true })
  clicksTemplate: TemplateRef<any>;

  @ViewChild('impressionsTemplate', { static: true })
  impressionsTemplate: TemplateRef<any>;

  @ViewChild('reachTemplate', { static: true })
  reachTemplate: TemplateRef<any>;

  @ViewChild('contentToClipboardIcon', { static: true })
  contentToClipboardIcon: TemplateRef<any>;

  @ViewChild('businessTemplate', { static: true })
  businessTemplate: TemplateRef<any>;

  @ViewChild('selectableTemplate', { static: true })
  selectableTemplate: TemplateRef<any>;

  @ViewChild('numberCell', { static: true })
  numberCell: TemplateRef<any>;

  @ViewChild('integerCell', { static: true })
  integerCell: TemplateRef<any>;

  @ViewChild('startCase', { static: true })
  startCase: TemplateRef<any>;

  @ViewChild('searchCampaignAndRouteToDetails', { static: true })
  searchCampaignAndRouteToDetails: TemplateRef<any>;

  @ViewChild('viewCampaignDetails', { static: true })
  viewCampaignDetails: TemplateRef<any>;

  @ViewChild('viewHeader', { static: true })
  viewHeader: TemplateRef<any>;

  @Input()
  state;

  @Input()
  config?: any = {};

  @Output()
  columnUpdated = new EventEmitter<any>();

  public isLoaded = false;

  private subscription: Subscription = new Subscription();

  constructor(private _clipboardService: ClipboardService, private modalService: NzModalService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  providerIcon(provider: string) {
    return providerSquareIcons[provider];
  }

  providerColor(provider: string) {
    return providerColors[provider];
  }

  statusIcon(statusName: CampaignStatusType) {
    return CampaignStatusIcons[statusName];
  }

  onCopyCellContent(tooltip, value: string): void {
    this._clipboardService.copyFromContent(value);
    if (tooltip.isOpen()) {
      tooltip.close();
    }
    tooltip.open({ tipContent: 'Copied' });
  }

  tooltipOn(tooltip) {
    const tipContent = 'Copy to clipboard';
    if (!tooltip.isOpen()) {
      tooltip.open({ tipContent });
    }
  }

  tooltipOff(tooltip) {
    if (tooltip.isOpen()) {
      tooltip.close();
    }
  }

  columnIsValid(column): boolean {
    const result = typeof this.config?.columnIsValid === 'function' ? this.config?.columnIsValid(column) : false;
    return result;
  }

  openColumnEditor(column): void {
    const modal = this.modalService.create({
      nzTitle: 'Customize Column',
      nzContent: DataTableColumnEditModalComponent,
      nzComponentParams: {
        column: column,
        fieldsAvailable: this.config.availableColumns || [],
        options: this.config.options || [],
      },
      nzFooter: null,
      nzWidth: 300,
      nzClassName: 'custom-modal',
      nzCentered: true,
    });
    this.subscription = modal.afterClose.subscribe((field) => {
      field ? this.columnUpdated.emit({ column, field }) : null;
    });
  }

  toggleSelection(column): void {
    if (this.config && this.config.selectedColumns) {
      const selectedColumns = [...this.config.selectedColumns];
      const index = selectedColumns.indexOf(column.name);
      if (index !== -1) {
        selectedColumns.splice(index, 1);
      } else {
        selectedColumns.push(column.name);
      }
      this.columnUpdated.emit({ column, selectedColumns });
    }
  }

  isColumnSelected(column): boolean {
    return this.config?.selectedColumns ? this.config?.selectedColumns.includes(column.name) : false;
  }

  previewFacebookCreative(previewId: string): string {
    const postUrl = previewId.split('_');
    return `https://facebook.com/${postUrl[0]}/posts/${postUrl[1]}`;
  }
}
