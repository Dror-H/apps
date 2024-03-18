import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { InlineSVGModule } from 'ng-inline-svg';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AuthComponent } from './auth.component';

@Component({
  selector: 'app-onboarding-slider',
  template: `<div></div>`,
})
export class MockOnboardingSliderComponent {}

describe('AuthComponent: ', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgxsModule.forRoot([]),
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        NzLayoutModule,
        NzGridModule,
        InlineSVGModule,
      ],
      declarations: [AuthComponent, MockOnboardingSliderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
