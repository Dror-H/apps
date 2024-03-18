import { Component } from '@angular/core';
import { postTypeOptions } from '@app/pages/new-campaign/facebook-new-campaign/facebook-new-campaign.data';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';

@Component({
  selector: 'ingo-post-type-selector',
  templateUrl: './post-type-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PostTypeSelectorComponent,
      multi: true,
    },
  ],
})
export class PostTypeSelectorComponent extends ControlValueAccessorBaseHelper {
  public postTypeOptions = postTypeOptions;

  public displayPostsSelection($event): void {
    this.writeValue($event);
    this.onChanged($event);
  }
}
