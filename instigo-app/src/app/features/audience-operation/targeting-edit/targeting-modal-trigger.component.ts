import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { TargetingEditComponent } from './targeting-edit.component';

@Component({
  template: '',
})
export class TargetingModalTriggerComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  constructor(
    private readonly router: Router,
    private readonly modalService: NzModalService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const urlWithoutAuxiliaryRoute = this.router
      .createUrlTree(['.'], { relativeTo: this.route })
      .root.children[PRIMARY_OUTLET].toString();

    this.subscriptions.sink = this.route.params
      .pipe(
        map((params) => params[`id`]),
        map((targetingId) => {
          if (targetingId) {
            const targetingTemplate = this.route.snapshot.data?.targeting;

            return this.modalService.create({
              nzTitle: `Edit ${targetingTemplate.name} targeting template`,
              nzContent: TargetingEditComponent,
              nzComponentParams: {
                targetingTemplate,
              },
              nzStyle: { top: '20px' },
              nzWidth: 1140,
            });
          }
        }),
        switchMap((modalRef) => modalRef.afterClose.asObservable()),
      )
      .subscribe(() => {
        this.router.navigate([{ outlets: { dialog: null, primary: [urlWithoutAuxiliaryRoute] } }]);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
