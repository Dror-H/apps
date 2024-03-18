import { NgModule } from '@angular/core';
import { STORE, UiSharedModule } from '@instigo-app/ui/shared';
import { AdAccountSelectorContainerComponent } from '@audience-app/shared/components/ad-account-selector-container/ad-account-selector-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ExportToPipe } from '@audience-app/shared/components/ad-account-selector-container/export-to.pipe';

@NgModule({
  declarations: [AdAccountSelectorContainerComponent, ExportToPipe],
  imports: [UiSharedModule, ReactiveFormsModule, NzGridModule, NzButtonModule, NzTabsModule, NzDividerModule],
  exports: [AdAccountSelectorContainerComponent],
  providers: [{ provide: STORE, useExisting: Store }],
})
export class AdAccountSelectorContainerModule {}
