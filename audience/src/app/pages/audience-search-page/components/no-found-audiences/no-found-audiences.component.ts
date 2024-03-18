import { Component } from '@angular/core';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'audi-no-found-audiences',
  templateUrl: './no-found-audiences.component.html',
  styleUrls: ['./no-found-audiences.component.scss'],
})
export class NoFoundAudiencesComponent {
  @Select(AudiencesState.getNoFoundAudiencesCount) noFoundAudiencesCount$: Observable<number>;
}
