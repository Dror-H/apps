import { Component, Input, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { AdTemplateDTO } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-ad-preview-carousel',
  templateUrl: './ad-preview-carousel.component.html',
  styleUrls: ['./ad-preview-carousel.component.scss'],
})
export class AdPreviewCarouselComponent {
  @Input() formCombinations: AdTemplateDTO[];

  @ViewChild(NzCarouselComponent, { static: true }) carousel: NzCarouselComponent;

  public goTo(event: any, indexNumber: number): void {
    event.preventDefault();
    this.carousel.goTo(Number(this.carousel.activeIndex + indexNumber));
  }
}
