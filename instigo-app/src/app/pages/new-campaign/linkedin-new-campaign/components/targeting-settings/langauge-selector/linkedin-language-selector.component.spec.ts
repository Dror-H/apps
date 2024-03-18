import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkedinLanguageSelectorComponent } from './linkedin-language-selector.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild } from '@angular/core';

@Component({
  template:
    '<form [formGroup]="parentForm">' +
    '<ingo-linkedin-language-selector formControlName="locale"></ingo-linkedin-language-selector></form>',
})
class ParentMockComponent {
  public parentForm;

  @ViewChild(LinkedinLanguageSelectorComponent) child;

  constructor(private fb: FormBuilder) {
    this.parentForm = this.fb.group({
      locale: ['en_US', [Validators.required]],
    });
  }
}

describe('Linkedin Language Selector', () => {
  let parentFixture: ComponentFixture<ParentMockComponent>;
  let parentComponent: ParentMockComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedinLanguageSelectorComponent, ParentMockComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        UiSharedModule,
        FormsModule,
        TranslateModule.forRoot(),
        NzSelectModule,
        NzGridModule,
        NzFormModule,
      ],
    });

    parentFixture = TestBed.createComponent(ParentMockComponent);
    parentComponent = parentFixture.componentInstance;

    parentFixture.detectChanges();
  });

  it('should be defined', () => {
    expect(parentComponent).toBeDefined();
  });

  it('should get the defined value', () => {
    expect(parentComponent.child.selectedLanguage).toEqual('en_US');
  });

  it('should set new value in child and update the parent', () => {
    parentComponent.child.onChange('zh_CN');
    expect(parentComponent.parentForm.get('locale').value).toEqual('zh_CN');
  });

  it('should select language', () => {
    parentComponent.child.onLanguageSelect('zh_CN');
    expect(parentComponent.parentForm.get('locale').value).toEqual('zh_CN');
  });
});
