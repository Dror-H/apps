import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { ActionBoxComponent } from './action-box.component';

describe('ActionBoxComponent', () => {
  let component: ActionBoxComponent;
  let fixture: ComponentFixture<ActionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionBoxComponent],
      imports: [NzButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
