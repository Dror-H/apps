import { AfterViewInit, Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateTimeInterval } from '@instigo-app/data-transfer-object';
import { datePresets } from '@app/global/utils';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import Litepicker from 'litepicker';
import 'litepicker/dist/plugins/ranges.js';
import { isEqual } from 'date-fns/fp';
import { differenceInDays, endOfDay, format } from 'date-fns';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';

@Component({
  selector: 'ingo-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
})
export class DateRangePickerComponent
  extends ControlValueAccessorBaseHelper<DateTimeInterval>
  implements AfterViewInit
{
  @ViewChild('rangePicker')
  rangePicker: ElementRef;

  @Input() sourcePage = '';

  public selectedRange: Array<Date | string> = [];
  public ngZorroRanges: Date;
  public indicatorShown = false;
  public indicatorEnd = false;

  private value: DateTimeInterval;
  private datePresets: Array<any>;
  private picker: Litepicker;
  private isDatePickerInitialized = false;

  constructor(private analytics: AnalyticsService) {
    super();
    this.datePresets = datePresets(new Date());
  }

  ngAfterViewInit() {
    this.ngZorroRanges = this.datePresets.reduce(
      (acc, dataPreset) => ({ ...acc, [dataPreset.label]: [dataPreset.range.start, dataPreset.range.end] }),
      {},
    );
    this.initializePicker();
  }

  writeValue(val: DateTimeInterval) {
    this.value = val;
    this.selectedRange = [this.value?.dateRange?.start, this.value?.dateRange?.end];
    this.picker?.setDateRange(this.value?.dateRange?.start, this.value?.dateRange?.end);
  }

  private onDateChange(result: Date[]): void {
    const [from, to] = result;
    const [datePreset] = this.datePresets.filter(
      (datePreset) => isEqual(datePreset.range.start, from) && isEqual(datePreset.range.end, endOfDay(to)),
    );
    this.value = {
      datePreset: datePreset?.value || null,
      dateRange: {
        start: from,
        end: to,
      },
    };
    this.sendAnalyticsEvent(from, to, datePreset);
    this.onChanged(this.value);
  }

  private sendAnalyticsEvent(from: Date, to: Date, datePreset: any): void {
    if (this.isDatePickerInitialized) {
      this.analytics.sendEvent({
        event: 'DatePicker',
        action: datePreset?.value ? 'selectPreset' : 'selectManual',
        data: {
          event: 'DatePicker',
          date1: format(from, 'dd/MM/yyyy'),
          date2: format(to, 'dd/MM/yyyy'),
          preset: datePreset?.value || null,
          daysDifference: Math.abs(differenceInDays(from, to)),
        },
      });
    }
  }

  private initializePicker(): void {
    this.picker = new Litepicker({
      element: this.rangePicker.nativeElement,
      format: 'DD-MM-YYYY',
      delimiter: ' -  ',
      plugins: ['ranges'],
      ranges: {
        position: 'left',
        customRanges: this.ngZorroRanges,
      },
      singleMode: false,
      maxDate: new Date(),
      numberOfColumns: 2,
      numberOfMonths: 2,
      splitView: true,
      dropdowns: { minYear: 2006, maxYear: null, months: true, years: true },
    })
      .on('selected', (date1, date2) => {
        this.onDateChange([date1?.dateInstance, date2?.dateInstance]);
      })
      .on('render', (ui) => {
        const pickerHeader = document.createElement('div');
        pickerHeader.setAttribute('class', 'ingo-dp-header');
        const pickerTitle = document.createElement('span');
        pickerTitle.innerHTML = 'Select Range';
        pickerHeader.appendChild(pickerTitle);
        document.querySelector('.litepicker').prepend(pickerHeader);
      })
      .on('preselect', (date1, date2) => {
        this.indicatorEnd = true;
      })
      .on('show', (el) => {
        this.indicatorEnd = false;
        this.indicatorShown = true;
        this.picker.gotoDate(this.selectedRange[1], 1);
      })
      .on('hide', (el) => {
        this.indicatorEnd = false;
        this.indicatorShown = false;
      });

    setTimeout(() => {
      this.picker.setDateRange(this.selectedRange[0], this.selectedRange[1]);
      this.isDatePickerInitialized = true;
    });
  }
}
