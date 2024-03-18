import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { concatTimeStringToDate } from '@app/global/utils';
import { AdAccountDTO } from '@instigo-app/data-transfer-object';
import { endOfYesterday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import Litepicker from 'litepicker';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-date-picker',
  templateUrl: './data-picker.component.html',
  styleUrls: ['./data-picker.component.scss'],
})
export class DatePickerComponent implements OnInit, OnDestroy {
  @Input()
  isSelectedDateEmittable$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  @Input()
  adAccount: AdAccountDTO = null;
  @Output()
  dateTimeEmitter = new EventEmitter<Date>();

  @ViewChild('endPickerInner', { static: true })
  endPickerInner: ElementRef;
  public endPicker: Litepicker;
  public endDate: Date;
  public endTime = `${new Date().getHours()}:${new Date().getMinutes()}`;

  private subSink = new SubSink();

  ngOnInit(): void {
    this.initEndDatePicker();
    this.subSink.sink = this.isSelectedDateEmittable$.subscribe((isEmittable: boolean) => {
      if (isEmittable) {
        if (this.endDate) {
          this.dateTimeEmitter.emit(concatTimeStringToDate(this.endDate, this.endTime));
        } else {
          this.dateTimeEmitter.emit(null);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public clearEndDate() {
    this.endPicker.clearSelection();
    this.endDate = null;
  }

  public onPickerChange(date, picker: Litepicker): void {
    picker.setDate({ dateInstance: date });
  }

  private initEndDatePicker(): void {
    this.endPicker = new Litepicker({
      element: this.endPickerInner.nativeElement,
      inlineMode: false,
      format: 'MMM D, YYYY',
      autoApply: true,
      minDate: this.adAccount.timezoneName
        ? utcToZonedTime(endOfYesterday(), this.adAccount.timezoneName)
        : endOfYesterday(),
      dropdowns: { minYear: 2006, maxYear: null, months: true, years: true },
    }).on('selected', (date) => {
      this.endDate = date.dateInstance;
    });
  }
}
