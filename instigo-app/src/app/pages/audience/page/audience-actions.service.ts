import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { AudienceDto, NotificationType, TargetingDto } from '@instigo-app/data-transfer-object';
import { InputForModalComponent } from '@instigo-app/ui/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AudienceViewService } from '../audience-view.service';

@Injectable()
export class AudienceActionService implements OnDestroy {
  private name$ = new BehaviorSubject<string>('');
  private subsink = new SubSink();

  constructor(
    private readonly displayNotification: DisplayNotification,
    private readonly modal: NzModalService,
    private readonly audienceViewService: AudienceViewService,
    private readonly audienceApiService: AudienceApiService,
    private readonly targetingApiService: TargetingApiService,
  ) {}

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  public deleteAudiences(options: { audiences: Partial<AudienceDto>[] }): void {
    const { audiences } = options;
    const singOrMulti = audiences.length > 1 ? 's' : '';
    this.modal.confirm({
      nzTitle: 'Are you sure?',
      nzContent: `You won't be able to revert this!`,
      nzOkText: 'Delete',
      nzOkType: 'danger',
      nzOnOk: () => {
        const audienceIds = audiences.map(({ id }) => id);
        this.audienceApiService
          .deleteMany({ audienceIds })
          .pipe(
            tap((response) => {
              this.audienceViewService.audienceTableState.patchState({ selectedItems: [] });
              this.audienceViewService.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  title: `Audience${singOrMulti} Removed`,
                  content: `The selected audience${singOrMulti} have been successfully deleted`,
                  type: NotificationType.SUCCESS,
                }),
              );
            }),
            catchError((err: HttpErrorResponse) => {
              this.displayNotification.displayNotification(
                new Notification({
                  title: `Some of the selected audiences couldn't be deleted`,
                  content: err.error.message,
                  type: NotificationType.ERROR,
                }),
              );
              return throwError(new Error(err.message));
            }),
            take(1),
          )
          .subscribe();
      },
      nzCancelText: 'Cancel',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  public deleteTargetings(options: { targetings: Partial<TargetingDto>[] }): void {
    const { targetings } = options;
    this.modal.confirm({
      nzTitle: 'Are you sure?',
      nzContent: `You won't be able to revert this!`,
      nzOkText: 'Delete',
      nzOkType: 'danger',
      nzOnOk: () => {
        const targetingIds = targetings.map(({ id }) => id);
        return this.targetingApiService
          .deleteMany({ targetingIds })
          .pipe(
            tap(() => {
              this.audienceViewService.targetingTableState.patchState({ selectedItems: [] });
              this.audienceViewService.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  content: `Templates have been successfully deleted`,
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
            take(1),
          )
          .subscribe();
      },
      nzCancelText: 'Cancel',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  public duplicateTargeting(item: any): void {
    const timeNow = new Date();
    const defaultName = `${item.name}-copy-${timeNow.getDate()}-${timeNow.getMonth() + 1}`;
    this.name$.next(defaultName);
    this.modal.create({
      nzTitle: 'Duplicate targeting template',
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
        this.subsink.sink = this.targetingApiService
          .bulkCreate({ payload })
          .pipe(
            take(1),
            tap((res) => {
              this.audienceViewService.targetingTableState.patchState({ selectedItems: [] });
              this.audienceViewService.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  title: `Your ${name} targeting template has been duplicated.`,
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
