import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSliderModule } from 'ng-zorro-antd/slider';

import { CustomRatioComponent } from './custom-ratio.component';

describe('CustomRatioComponent', () => {
  let component: CustomRatioComponent;
  let fixture: ComponentFixture<CustomRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomRatioComponent],
      imports: [FormsModule, NzSliderModule, NzGridModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
