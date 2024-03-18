import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdTemplateApiService } from '@app/api/services/ad-template.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { NotificationType } from '@instigo-app/data-transfer-object';
import { InputForModalComponent } from '@instigo-app/ui/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AdTemplatePageService } from './ad-template-page.service';

@Injectable()
export class AdTemplateActionService implements OnDestroy {
  private name$ = new BehaviorSubject<string>('');
  private subsink = new SubSink();
  constructor(
    private readonly router: Router,
    private readonly displayNotification: DisplayNotification,
    private modal: NzModalService,
    private readonly adTemplateApiService: AdTemplateApiService,
    private readonly adTemplatePageService: AdTemplatePageService,
  ) {}

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  public delete(options: { items: any[] }): void {
    const { items } = options;
    this.modal.confirm({
      nzTitle: 'Are you sure?',
      nzContent: `You won't be able to revert this!`,
      nzOkText: 'Delete',
      nzOkType: 'danger',
      nzOnOk: () => {
        const ids = items.map(({ id }) => id);
        this.adTemplateApiService
          .deleteMany({ adTemplateIds: ids })
          .pipe(
            take(1),
            tap(() => {
              this.adTemplatePageService.updateTableState({ selectedItems: [] });
              this.adTemplatePageService.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  content: `AdTemplates have been successfully deleted`,
                  type: NotificationType.SUCCESS,
                }),
              );
            }),
            catchError((err: HttpErrorResponse) => {
              this.displayNotification.displayNotification(
                new Notification({ content: err.message, type: NotificationType.ERROR }),
              );
              return throwError(new Error(err.message));
            }),
          )
          .subscribe();
      },
      nzCancelText: 'Cancel',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  public edit(item: any): void {
    void this.router.navigate([{ outlets: { dialog: ['ad-template-operation', 'edit', item.id] } }]);
  }

  public duplicate(item: any): void {
    const timeNow = new Date();
    const defaultName = `${item.name}-copy-${timeNow.getDate()}-${timeNow.getMonth() + 1}`;
    this.name$.next(defaultName);
    this.modal.create({
      nzTitle: 'Duplicate ad template',
      nzContent: InputForModalComponent,
      nzComponentParams: { entityNameSubject$: this.name$ },
      nzOkText: 'Duplicate',
      nzOkType: 'primary',
      nzWidth: 500,
      nzOkDisabled: !this.name$.value,
      nzOnOk: () => {
        const name = this.name$.value || defaultName;
        const payload = [
          { ...item, name, id: undefined, createdAt: undefined, updatedAt: undefined, version: undefined },
        ];
        this.subsink.sink = this.adTemplateApiService
          .bulkCreate({ payload })
          .pipe(
            take(1),
            tap((res) => {
              this.adTemplatePageService.updateTableState({ selectedItems: [] });
              this.adTemplatePageService.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  title: `Your ${name} ad template has been duplicated.`,
                  type: NotificationType.SUCCESS,
                }),
              );
            }),
            catchError((err: HttpErrorResponse) => {
              const e = err?.error;
              this.displayNotification.displayNotification(
                new Notification({ title: e?.title, content: e?.description, type: NotificationType.ERROR }),
              );
              return of();
            }),
            take(1),
          )
          .subscribe();
      },
    });
  }
}
