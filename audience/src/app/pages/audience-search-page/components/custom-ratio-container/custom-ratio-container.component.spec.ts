import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Ratio } from '@audience-app/pages/audience-search-page/components/custom-ratio/custom-ratio.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CustomRatioContainerComponent } from './custom-ratio-container.component';

@Component({ template: `<div></div>`, selector: 'audi-custom-ratio' })
export class CustomRatioMockComponent {
  @Input() public ratiosEnabled = false;
  @Input() public ratios: Ratio[];
}

describe('CustomRatioContainerComponent', () => {
  let component: CustomRatioContainerComponent;
  let fixture: ComponentFixture<CustomRatioContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomRatioContainerComponent, CustomRatioMockComponent],
      imports: [NoopAnimationsModule, FormsModule, NzSwitchModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRatioContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
