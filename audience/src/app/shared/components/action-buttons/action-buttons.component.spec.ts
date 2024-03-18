import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { ActionButtonsComponent } from './action-buttons.component';

describe('ActionButtonsComponent', () => {
  let component: ActionButtonsComponent;
  let fixture: ComponentFixture<ActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionButtonsComponent],
      imports: [NzGridModule, NzButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionButtonsComponent);
    component = fixture.componentInstance;
    component.actionButtons = [
      { label: 'Recommended', action: 'SEE_RECOMMENDED', active: true },
      { label: 'Load Saved Audience', action: 'LOAD_SAVED_AUDIENCES', active: false },
      { label: 'Create New Audience', action: 'CRETE_NEW_AUDIENCE', active: false },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click an option', () => {
    const spy = jest.spyOn(component.clickEvent, 'emit');
    component.onClick(1, 'LOAD_SAVED_AUDIENCES');

    expect(spy).toHaveBeenCalledWith('LOAD_SAVED_AUDIENCES');
  });

  it('should update the array', () => {
    component.onClick(1, 'LOAD_SAVED_AUDIENCES');

    expect(component.actionButtons).toEqual([
      { action: 'SEE_RECOMMENDED', active: false, label: 'Recommended' },
      { action: 'LOAD_SAVED_AUDIENCES', active: true, label: 'Load Saved Audience' },
      { action: 'CRETE_NEW_AUDIENCE', active: false, label: 'Create New Audience' },
    ]);
  });
});
