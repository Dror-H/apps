import { Component, forwardRef, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AdAccountSelectorContainerComponent } from '@audience-app/shared/components/ad-account-selector-container/ad-account-selector-container.component';
import { AdAccountDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { STORE } from '@instigo-app/ui/shared';
import { NgxsModule, Store } from '@ngxs/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'ingo-ad-account-selector',
  template: `<div></div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockAdAccountSelectorComponent),
      multi: true,
    },
  ],
})
export class MockAdAccountSelectorComponent implements ControlValueAccessor {
  @Input() provider: SupportedProviders;

  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;

  @Input()
  campaignObjectives;

  @Input()
  adAccountList: AdAccountDTO[];

  registerOnTouched(fn: any): void {}

  registerOnChange(fn: any): void {}

  writeValue(obj: any): void {}

  setDisabledState(isDisabled: boolean): void {}
}

@Pipe({
  name: 'exportTo',
})
export class MockExportToPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('AdAccountSelectorContainerComponent', () => {
  let component: AdAccountSelectorContainerComponent;
  let fixture: ComponentFixture<AdAccountSelectorContainerComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdAccountSelectorContainerComponent, MockExportToPipe, MockAdAccountSelectorComponent],
      imports: [ReactiveFormsModule, NgxsModule.forRoot(), NzGridModule, NzButtonModule, NzTabsModule, NzDividerModule],
      providers: [
        { provide: STORE, useClass: Store },
        { provide: NzModalRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdAccountSelectorContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    store.reset({ user: { adAccounts: 'test' } });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set component adAccountList to state.user.adAccounts', () => {
    expect(component.adAccountList).toBe('test');
  });

  it('should call _modalRef.close with value of form account field', () => {
    const spy = jest.spyOn((component as any)._modalRef, 'close');
    component.group.get('account').setValue('test');
    component.exportToFacebook();
    expect(spy).toBeCalledWith('test');
  });
});
