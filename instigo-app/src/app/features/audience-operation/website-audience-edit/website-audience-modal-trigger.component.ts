import { Component } from '@angular/core';
import { SubSink } from 'subsink';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, switchMap } from 'rxjs/operators';
import { WebsiteAudienceEditComponent } from './website-audience-edit.component';

@Component({ template: '' })
export class WebsiteAudienceModalTriggerComponent {
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
            const websiteAudienceTemplate = this.route.snapshot.data?.targeting;
            return this.modalService.create({
              nzTitle: `Edit ${websiteAudienceTemplate.name} website custom audience`,
              nzContent: WebsiteAudienceEditComponent,
              nzComponentParams: {
                websiteAudienceTemplate: websiteAudienceTemplate,
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
