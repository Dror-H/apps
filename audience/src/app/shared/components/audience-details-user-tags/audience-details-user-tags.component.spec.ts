import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { AudienceDetailsUserTagsComponent } from './audience-details-user-tags.component';

describe('AudienceDetailsUserTagsComponent', () => {
  let component: AudienceDetailsUserTagsComponent;
  let fixture: ComponentFixture<AudienceDetailsUserTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceDetailsUserTagsComponent],
      imports: [NzDividerModule, NzTagModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceDetailsUserTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
