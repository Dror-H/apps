import { Component, forwardRef } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ingo-linkedin-language-selector',
  templateUrl: './linkedin-language-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LinkedinLanguageSelectorComponent),
      multi: true,
    },
  ],
})
export class LinkedinLanguageSelectorComponent implements ControlValueAccessor {
  public linkedinLocales = linkedinLocales;
  public selectedLanguage: NzSelectOptionInterface;

  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(obj: any): void {
    this.selectedLanguage = obj;
  }

  public onLanguageSelect(language: NzSelectOptionInterface) {
    this.onChange(language);
  }
}

export const linkedinLocales = [
  { value: 'en_US', label: 'English' },
  { value: 'ar_AE', label: 'Arabic' },
  { value: 'zh_CN', label: 'Chinese - Simplified' },
  { value: 'zh_TW', label: 'Chinese - Traditional' },
  { value: 'cs_CZ', label: 'Czech' },
  { value: 'da_DK', label: 'Danish' },
  { value: 'in_ID', label: 'Indonesian' },
  { value: 'ms_MY', label: 'Malaysian' },
  { value: 'nl_NL', label: 'Dutch' },
  { value: 'fr_FR', label: 'French' },
  { value: 'fi_FI', label: 'Finnish' },
  { value: 'de_DE', label: 'German' },
  { value: 'it_IT', label: 'Italian' },
  { value: 'ja_JP', label: 'Japanese' },
  { value: 'ko_KR', label: 'Korean' },
  { value: 'no_NO', label: 'Norwegian' },
  { value: 'pl_PL', label: 'Polish' },
  { value: 'pt_BR', label: 'Portuguese' },
  { value: 'ro_RO', label: 'Romanian' },
  { value: 'ru_RU', label: 'Russian' },
  { value: 'es_ES', label: 'Spanish' },
  { value: 'sv_SE', label: 'Swedish' },
  { value: 'th_TH', label: 'Thai' },
  { value: 'tl_PH', label: 'Filipino' },
  { value: 'tr_TR', label: 'Turkish' },
] as NzSelectOptionInterface[];
