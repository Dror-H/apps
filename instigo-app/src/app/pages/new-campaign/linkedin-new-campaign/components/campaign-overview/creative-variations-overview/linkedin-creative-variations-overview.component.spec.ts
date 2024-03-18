import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LinkedinCreativeVariationsOverviewComponent } from '@app/pages/new-campaign/linkedin-new-campaign/components/campaign-overview/creative-variations-overview/linkedin-creative-variations-overview.component';

import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MultiVariateCreativesService } from '@app/pages/new-campaign/services/multi-variate-creatives.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { of } from 'rxjs';

@Component({
  selector: 'ingo-create-new-variations-overview',
  template: '',
})
export class CreativeVariationsMockComponent {
  @Input() editPage;
  @Input() canAddVariations;
  @Input() multivariateFields;
}

const fb = new FormBuilder();

describe('LinkedinCreativeOverviewComponent', () => {
  let component: LinkedinCreativeVariationsOverviewComponent;
  let fixture: ComponentFixture<LinkedinCreativeVariationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkedinCreativeVariationsOverviewComponent, CreativeVariationsMockComponent],
      imports: [NzCardModule],
      providers: [{ provide: MultiVariateCreativesService, useValue: { canAddVariation: of(false) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedinCreativeVariationsOverviewComponent);
    component = fixture.componentInstance;
    component.creativesForm = fb.group({ multivariate: fb.group({ image: [] }) });
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should get false < 1 second', fakeAsync(() => {
    component.ngOnInit();
    component.ngOnDestroy();
    expect(component.value).toBe(false);
  }));

  it('should call unsubscribe', fakeAsync(() => {
    component.ngOnInit();
    const spy = jest.spyOn((component as any).subSink, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get false > 1 second', fakeAsync(() => {
    component.ngOnInit();
    tick(1500);
    expect(component.value).toBe(true);
  }));
});
