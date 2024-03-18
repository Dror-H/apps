import { Component } from '@angular/core';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { audienceSourceOptions } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-targeting-type',
  templateUrl: './targeting-type-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TargetingTypeSelectorComponent,
      multi: true,
    },
  ],
})
export class TargetingTypeSelectorComponent extends ControlValueAccessorBaseHelper {
  public audienceSourceOptions = audienceSourceOptions;

  public audienceActiveSource($event): void {
    this.writeValue($event);
    this.onChanged($event);
  }
}
