import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InlineSVGModule } from 'ng-inline-svg';
import { OnboardingSliderComponent } from './onboarding-slider.component';
@Component({
  template: `<div></div>`,
  selector: 'ngb-carousel',
})
class MockNgbCarouselComponent {
  @Input() interval: number;
  @Input() showNavigationArrows: string;
}

describe('OnboardingSliderComponent: ', () => {
  let component: OnboardingSliderComponent;
  let fixture: ComponentFixture<OnboardingSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingSliderComponent, MockNgbCarouselComponent],
      imports: [InlineSVGModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
