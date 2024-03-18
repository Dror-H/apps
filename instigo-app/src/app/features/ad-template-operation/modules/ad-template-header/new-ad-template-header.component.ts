import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { SupportedProviders } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'app-new-ad-template-header',
  templateUrl: './new-ad-template-header.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewAdTemplateHeaderComponent),
      multi: true,
    },
  ],
})
export class NewAdTemplateHeaderComponent extends ControlValueAccessorBaseHelper {
  @Input() availableProvider;

  constructor() {
    super();
  }

  onInputChange({ provider }: { provider: SupportedProviders; icon: string }): void {
    this.writeValue(provider);
    this.onChanged(provider);
  }
}
