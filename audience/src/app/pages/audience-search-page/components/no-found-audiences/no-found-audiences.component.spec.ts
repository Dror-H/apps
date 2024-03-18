import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';

import { NoFoundAudiencesComponent } from './no-found-audiences.component';

describe('NoFoundAudiencesComponent', () => {
  let component: NoFoundAudiencesComponent;
  let fixture: ComponentFixture<NoFoundAudiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoFoundAudiencesComponent],
      imports: [StoreTestBedModule.configureTestingModule([AudiencesState])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoFoundAudiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
