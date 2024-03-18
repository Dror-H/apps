import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { LinkedinMultivariateAdsComponent } from './linkedin-multivariate-ads.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ingo-linkedin-image-multivariate',
  template: '',
})
class MockImageMultivariateComponent {
  @Input() multivariateImageForm;
}

@Component({
  selector: 'ingo-linkedin-preview-carousel-container',
  template: '',
})
class MockPreviewCarouselComponent {
  @Input() multivariate;
}

describe('LinkedinMultivariateAds', () => {
  let component: LinkedinMultivariateAdsComponent;
  let fixture: ComponentFixture<LinkedinMultivariateAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockImageMultivariateComponent, MockPreviewCarouselComponent, LinkedinMultivariateAdsComponent],
      imports: [CommonModule, NzGridModule, NzButtonModule, NzDividerModule],
    });

    fixture = TestBed.createComponent(LinkedinMultivariateAdsComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
