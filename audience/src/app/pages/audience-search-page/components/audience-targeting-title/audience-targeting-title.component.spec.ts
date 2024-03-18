import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { AudienceTargetingTitleComponent } from './audience-targeting-title.component';

describe('AudienceTargetingTitleComponent', () => {
  let component: AudienceTargetingTitleComponent;
  let fixture: ComponentFixture<AudienceTargetingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceTargetingTitleComponent],
      imports: [NzDividerModule, NzTypographyModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceTargetingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
