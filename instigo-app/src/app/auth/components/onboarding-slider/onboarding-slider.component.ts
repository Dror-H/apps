import { Component, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-onboarding-slider',
  templateUrl: './onboarding-slider.component.html',
  styleUrls: ['./onboarding-slider.component.scss'],
})
export class OnboardingSliderComponent {
  public slides: any[] = [
    {
      id: 1,
      title: 'Start optimizing your marketing efforts with four clicks.',
      image: './assets/images/auth/onboarding-g1.svg',
    },
    {
      id: 2,
      title: 'Manage your advertising on multiple platforms all at once.',
      image: './assets/images/auth/onboarding-g2.svg',
    },
    {
      id: 3,
      title: 'Create a workflow that fits your team objectives and timeline.',
      image: './assets/images/auth/onboarding-g3.svg',
    },
  ];
  public showNavigationArrows = false;
  public navArrows = false;
  public pauseOnHover = true;

  @ViewChild('onboardingCarousel', { static: true })
  carousel: NgbCarousel;

  moveNext() {
    this.carousel.next();
  }

  getPrev() {
    this.carousel.prev();
  }
}
