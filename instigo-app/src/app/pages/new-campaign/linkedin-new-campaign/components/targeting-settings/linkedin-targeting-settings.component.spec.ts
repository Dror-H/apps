import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdAccountDTO } from '@instigo-app/data-transfer-object';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { LinkedinTargetingSettingsComponent } from './linkedin-targeting-settings.component';

@Component({
  selector: 'app-linkedin-saved-audience-targeting',
  template: '',
})
class SavedAudienceMockComponent {
  @Input() audienceTypeForm: AdAccountDTO;
}

@Component({
  selector: 'ingo-linkedin-language-selector',
  template: '',
})
class LanguageSelectorMockComponent {
  @Input() adAccount: AdAccountDTO;
}

const fb = new FormBuilder();
describe('linkedin targeting settings', () => {
  let fixture: ComponentFixture<LinkedinTargetingSettingsComponent>;
  let component: LinkedinTargetingSettingsComponent;
  let audienceForm: FormGroup;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkedinTargetingSettingsComponent, SavedAudienceMockComponent, LanguageSelectorMockComponent],
      imports: [ReactiveFormsModule, NzCardModule, NzFormModule, NzDividerModule, NzButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    audienceForm = fb.group({
      targetingCriteria: fb.group({
        adAccount: [],
      }),
    });
    fixture = TestBed.createComponent(LinkedinTargetingSettingsComponent);
    component = fixture.componentInstance;
    component.adAccount = 'andy' as unknown as AdAccountDTO;
    component.targetingForm = audienceForm;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should set the ad account on the form', () => {
    component.ngOnInit();
    expect(component.targetingForm.get('targetingCriteria.adAccount').value).toEqual('andy');
  });
});
