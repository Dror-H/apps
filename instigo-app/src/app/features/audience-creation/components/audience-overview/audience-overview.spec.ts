import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import {
  AudienceSubType,
  AudienceType,
  FacebookAudienceFields,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { NgxsModule } from '@ngxs/store';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AudienceOverviewComponent } from './audience-overview.component';
import { providerListMapColumnConfig, providerListSelectionConfig } from './test-data';

@Component({
  selector: 'app-data-table',
  template: '',
})
export class DataTableComponent {
  @Input() tableConfiguration: TableConfiguration;
  @Input() state: TableState;
  @Input() tableData: Array<any>;
  @Output() columnsChange = new EventEmitter<any[]>();
  @Output() stateChange = new EventEmitter<Partial<TableState>>();
}

@Component({
  selector: 'app-data-table-templates',
  template: '',
})
export class DataTableTemplatesComponent {
  @Input() state;
  @Input() config?: any = {};
}

describe('AudienceOverviewComponent: ', () => {
  let component: AudienceOverviewComponent;
  let fixture: ComponentFixture<AudienceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudienceOverviewComponent, DataTableComponent, DataTableTemplatesComponent],
      imports: [
        CommonModule,
        NgxsModule.forRoot([]),
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        NzDividerModule,
        NzCardModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AudienceOverviewComponent);
    component = fixture.componentInstance;

    component.audienceForm = new FormGroup({
      name: new FormControl('name'),
      provider: new FormControl('facebook'),
      audienceType: new FormControl(AudienceType.CUSTOM_AUDIENCE),
      audienceSubType: new FormControl(AudienceSubType.WEBSITE),
      target: new FormControl({ include: '', exclude: '' }),
      adAccount: new FormControl('123456'),
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  describe('onColumnChange', () => {
    it('should update "target" form control["fieldsSelection"] and providersList.config.selectedColumns if selectedColumns is received', () => {
      const targetControl = component.audienceForm.controls.target;
      targetControl.setValue({ ...targetControl.value, fieldsSelection: ['email', 'phone', 'remove me column'] });
      component.providersList = providerListSelectionConfig;

      component.onColumnChange(SupportedProviders.FACEBOOK, {
        column: { name: 'remove me column', value: 'remove me column' },
        selectedColumns: ['email', 'phone'],
      });

      expect(targetControl.value.fieldsSelection).toEqual(['email', 'phone']);
      expect(component.providersList.config.selectedColumns).not.toContain('remove me column');
    });

    it('should map selected column to selected field if field is received', () => {
      const COLUMN_TO_MAP = 'map me';
      const MAPPED_COLUMN = 'mapped column';
      const targetControl = component.audienceForm.controls.target;
      targetControl.setValue({
        ...targetControl.value,
        fieldsSelection: ['email', 'phone', COLUMN_TO_MAP],
        fields: ['email', 'phone', COLUMN_TO_MAP],
      });
      component.providersList = providerListMapColumnConfig;

      component.onColumnChange(SupportedProviders.FACEBOOK, {
        column: { name: COLUMN_TO_MAP, value: COLUMN_TO_MAP },
        field: MAPPED_COLUMN,
      });

      const expectationValues = [
        targetControl.value.fields,
        targetControl.value.fieldsSelection,
        component.providersList.config.selectedColumns,
      ];
      expectationValues.forEach((expectationValue) => {
        expect(expectationValue).toContain(MAPPED_COLUMN);
        expect(expectationValue).not.toContain(COLUMN_TO_MAP);
      });

      expect(component.providersList.config.availableColumns).not.toContain(MAPPED_COLUMN);
      // availableColumns is always updated from static FacebookAudienceFields calling onColumnChange with field
      if (FacebookAudienceFields.includes(COLUMN_TO_MAP)) {
        expect(component.providersList.config.availableColumns).toContain(COLUMN_TO_MAP);
      }
    });
  });
});
