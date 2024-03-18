import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { providerColors, providerIcons } from '@app/global/constants';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { AdAccountDTO } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-ad-account-dropdown-selector',
  templateUrl: './dashboard-ad-account-dropdown-selector.component.html',
  styleUrls: ['./dashboard-ad-account-dropdown-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DashboardAdAccountDropdownSelectorComponent),
      multi: true,
    },
  ],
})
export class DashboardAdAccountDropdownSelectorComponent extends ControlValueAccessorBaseHelper {
  @Input() adAccounts: AdAccountDTO[] = [];

  public providerIcons = providerIcons;
  public providerColors = providerColors;

  constructor(private analytics: AnalyticsService) {
    super();
  }

  onInputChange($event) {
    this.analytics.sendEvent({
      event: 'AdAccount',
      action: 'account_change',
      data: {
        event: 'AdAccount',
        eventLocation: 'Ad Account Dashboard',
        prevAccountName: this._value?.name || '',
        newAccountName: $event.name,
        newAccountId: $event.id,
      },
    });
    this.writeValue($event);
    this.onChanged($event);
  }
}
