import { Component, Input, OnInit } from '@angular/core';
import { FileManagerApiService } from '@app/api/services/file-manager.api.service';
import { UploadUtilityApiService } from '@app/api/services/upload-utility.api.service';
import { File, SupportedProviders } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './select-existing.component.html',
  styles: [],
})
export class SelectExistingComponent implements OnInit {
  @Input() isImage;
  public pageIndex = 1;
  public pageSize = 10;
  public mediaNumber = 0;
  public files = [];
  public radioValue = 'instigo';

  constructor(
    private fileManagerApiService: FileManagerApiService,
    private readonly uploadUtilityApiService: UploadUtilityApiService,
    public activeModal: NzModalRef,
  ) {}

  ngOnInit(): void {
    this.fetchFiles(this.radioValue);
  }

  public selectMedia(file): void {
    this.activeModal.close(file);
  }

  public async getFileObjectUrl(file: File, media: HTMLImageElement | HTMLSourceElement): Promise<void> {
    if (file.provider === null) {
      const blob = await this.uploadUtilityApiService.download({ filePath: file.key }).toPromise();
      media.src = window.URL.createObjectURL(blob);
    } else {
      console.error(`File from provider ${file.provider} couldn't be rendered`);
    }
  }

  public closeModal(): void {
    this.activeModal.destroy();
  }

  public onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.fetchFiles(this.radioValue);
  }

  public onSourceChange(source: string): void {
    this.pageIndex = 1;
    this.fetchFiles(source);
  }

  private fetchFiles(source: string): void {
    this.fileManagerApiService
      .findAll(this.getQuery(source))
      .pipe(
        map((response: any) => {
          this.files = response.data;
          this.mediaNumber = response.total;
        }),
      )
      .subscribe();
  }

  private getQuery(source: string): string {
    let qb = RequestQueryBuilder.create()
      .setLimit(this.pageSize)
      .setPage(this.pageIndex)
      .setFilter({
        field: 'mimetype',
        operator: CondOperator.STARTS,
        value: this.isImage === true ? 'image/' : 'video/',
      })
      .sortBy({ field: 'updatedAt', order: 'DESC' });
    qb = this.setSourceFilter(qb, source);

    return qb.query();
  }

  private setSourceFilter(qb: RequestQueryBuilder, source: string): RequestQueryBuilder {
    switch (source) {
      case SupportedProviders.FACEBOOK: {
        qb.setFilter({
          field: 'provider',
          operator: CondOperator.EQUALS,
          value: SupportedProviders.FACEBOOK,
        });
        break;
      }
      default: {
        qb.setFilter({
          field: 'provider',
          operator: CondOperator.IS_NULL,
        });
        break;
      }
    }
    return qb;
  }
}
