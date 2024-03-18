import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzCardModule } from 'ng-zorro-antd/card';
import { LinkedinCreativeSettingsComponent } from './linkedin-creative-settings.component';

@Component({
  selector: 'ingo-linkedin-multivariate-ads',
  template: '',
})
export class MultivariateMockComponent {
  @Input() multivariate;
  @Output() nextStepEmitter = new EventEmitter();
}

describe('linkedin creatives settings', () => {
  let fixture: ComponentFixture<LinkedinCreativeSettingsComponent>;
  let component: LinkedinCreativeSettingsComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkedinCreativeSettingsComponent, MultivariateMockComponent],
      imports: [NzCardModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinCreativeSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
