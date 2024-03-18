import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AdTemplateEditModalComponent } from './modules/ad-template-edit-modal/ad-template-edit-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdTemplateService } from '@app/features/ad-template-operation/services/ad-template.service';
import { EMPTY, of } from 'rxjs';

@Component({
  template: '',
})
export class AdTemplateModalTriggerComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  constructor(
    private readonly router: Router,
    private readonly modalService: NzModalService,
    private readonly route: ActivatedRoute,
    private adTemplateService: AdTemplateService,
  ) {}

  ngOnInit(): void {
    const urlWithoutAuxiliaryRoute = this.router
      .createUrlTree(['.'], { relativeTo: this.route })
      .root.children[PRIMARY_OUTLET].toString();

    this.subscriptions.sink = this.route.params
      .pipe(
        map((params) => params[`id`]),
        map((adTemplateId) => {
          if (adTemplateId) {
            const adTemplate = this.route.snapshot.data?.adTemplate;

            return this.modalService.create({
              nzTitle: `Edit ${adTemplate.name}`,
              nzContent: AdTemplateEditModalComponent,
              nzComponentParams: {
                adTemplate,
              },
              nzStyle: { top: '20px' },
              nzWidth: 1140,
            });
          }
        }),
        switchMap((modalRef) => modalRef.afterClose.asObservable()),
        switchMap((result) => {
          if (result != null) {
            return this.adTemplateService.updateAdTemplate(result.id, result.payload, result.name);
          } else {
            return of(EMPTY);
          }
        }),
      )
      .subscribe(() => {
        void this.router.navigate([{ outlets: { dialog: null, primary: [urlWithoutAuxiliaryRoute] } }]).then(() => {
          window.location.reload();
        });
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
