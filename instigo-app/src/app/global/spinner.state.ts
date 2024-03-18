import { Injectable } from '@angular/core';
import { Loading } from '@instigo-app/data-transfer-object';
import { Action, State, StateContext } from '@ngxs/store';
import { NgxSpinnerService } from 'ngx-spinner';

interface SpinnerStateModel {
  loading: boolean;
}

@State<SpinnerStateModel>({
  name: 'spinner',
  defaults: {
    loading: false,
  },
})
@Injectable()
export class SpinnerState {
  constructor(private spinner: NgxSpinnerService) {}

  @Action(Loading)
  loading({ patchState }: StateContext<SpinnerState>, { payload }) {
    const { loading } = payload;
    if (loading) {
      void this.spinner.show();
    } else {
      void this.spinner.hide();
      patchState({ loading });
    }
  }
}
