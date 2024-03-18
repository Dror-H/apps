/* eslint-disable @typescript-eslint/no-empty-function */
import { Directive, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export abstract class ControlValueAccessorBaseHelper<T = any> implements ControlValueAccessor {
  disabled: boolean;
  _value: any;

  @Output() valueChanged = new EventEmitter<T>();

  onChanged: any = () => {};
  onTouched: any = () => {};

  writeValue(val) {
    this._value = val;
    this.valueChanged.emit(val);
  }

  registerOnChange(fn: any) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled): void {
    this.disabled = isDisabled;
  }
}
