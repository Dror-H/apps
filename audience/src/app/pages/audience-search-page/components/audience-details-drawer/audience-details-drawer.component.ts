import { Component } from '@angular/core';
import {
  AudienceDetailsDrawerState,
  AudienceDetailsDrawerStateModel,
} from '@audience-app/store/audience-details-drawer.state';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-details-drawer',
  templateUrl: './audience-details-drawer.component.html',
  styleUrls: ['./audience-details-drawer.component.scss'],
})
export class AudienceDetailsDrawerComponent {
  @Select(AudienceDetailsDrawerState.get) drawerState$: Observable<AudienceDetailsDrawerStateModel>;
  @Emitter(AudienceDetailsDrawerState.set) drawerStateEmitter: Emittable<AudienceDetailsDrawerStateModel>;

  public closeDrawer(): void {
    this.drawerStateEmitter.emit({ isVisible: false, data: null });
  }
}
