import { Component, OnDestroy, OnInit } from '@angular/core';
import { FacebookSdkMethodsService } from '@app/shared/facebook-sdk-methods/facebook-sdk-methods.service';
import to from 'await-to-js';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { LeadgenFormService } from '../leadgen-form.service';

@Component({
  selector: 'ingo-create-lead-form-modal',
  templateUrl: './create-lead-form-modal.component.html',
  styleUrls: ['./create-lead-form-modal.component.scss'],
  providers: [FacebookSdkMethodsService, LeadgenFormService],
})
export class CreateLeadFormModalComponent implements OnInit, OnDestroy {
  public selectedPage: any = null;
  public sources: NzSelectOptionInterface[] = [];
  public disabled = true;

  private subsink = new SubSink();

  constructor(
    private leadgenFormService: LeadgenFormService,
    private modal: NzModalRef,
    private facebookSdkMethodsService: FacebookSdkMethodsService,
  ) {}

  ngOnInit(): void {
    this.extractPagesFromFilterAndAddToSources();
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  public extractPagesFromFilterAndAddToSources() {
    this.subsink.sink = this.leadgenFormService.filters$
      .pipe(
        map((data: any) =>
          data.pages.map((page) => ({
            label: page.name,
            value: page,
          })),
        ),
      )
      .subscribe((pages: any) => (this.sources = pages));
  }

  public onSourceChange(source): void {
    this.selectedPage = source;
    if (source) {
      this.disabled = false;
    }
  }

  public destroyModal(): void {
    this.modal.destroy();
  }

  public async createLeadgenForm(): Promise<void> {
    const [error, response] = await to(
      this.facebookSdkMethodsService.createLeadgenForm({
        adAccountProviderId: this.selectedPage.adAccountProviderId,
        selectedPageId: this.selectedPage.providerId,
      }),
    );
    if (response) {
      this.leadgenFormService.refresh$.next(null);
    }
    this.destroyModal();
  }
}
