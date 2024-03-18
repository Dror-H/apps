import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { concatTimeStringToDate } from '@app/global/utils';
import { AdAccountDTO, BudgetType } from '@instigo-app/data-transfer-object';
import { add, compareAsc, endOfYesterday, parseISO, startOfTomorrow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import Litepicker from 'litepicker';
import { interval } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-campaign-schedule',
  templateUrl: './campaign-schedule.component.html',
  styleUrls: ['./campaign-schedule.component.scss'],
})
export class CampaignScheduleComponent implements OnInit {
  private static UPDATE_TIME_INTERVAL = 20000;

  @Input() budgetForm = new FormGroup({});
  @ViewChild('startPickerInner', { static: true })
  startPickerInner: ElementRef;

  @ViewChild('endPickerInner', { static: true })
  endPickerInner: ElementRef;

  public startPicker: Litepicker;
  public endPicker: Litepicker;
  public budgetType = BudgetType;
  public adAccount: AdAccountDTO;

  private subSink = new SubSink();

  private get startDate(): string {
    return this.range.get('startDate').value;
  }

  private set startDate(date: string) {
    this.range.get('startDate').setValue(date);
  }

  private get endDate(): Date {
    return this.range.get('endDate').value;
  }

  private set endDate(date: Date) {
    this.range.get('endDate').setValue(date);
  }

  private get range(): AbstractControl {
    return this.budgetForm.get('range');
  }

  private set endTime(date: string) {
    this.range.get('endTime').setValue(date);
  }

  private get adAccountControl(): FormControl {
    return this.budgetForm.parent.get('settings.account') as FormControl;
  }

  ngOnInit(): void {
    this.setDefaultTimezone();
    this.updateStartTimeAccordinglyToTimezone();
    this.initializePicker();
    this.listenOnBudgetTypeChangesAndUpdateDayPartingAndEndDate();
    this.updateStartDateMinutesWhenInThePast();
  }

  public onPickerChange(date, picker: Litepicker): void {
    picker.setDate({ dateInstance: date });
  }

  public clearEndDate() {
    this.endPicker.clearSelection();
    this.endDate = null;
    this.endTime = null;
  }

  private initializePicker(): void {
    this.initStartDatePicker();
    this.initEndDatePicker();
  }

  // TODO: take this shit outta here
  private setDefaultTimezone(): void {
    this.adAccount = this.adAccountControl.value;
    const defaultTimezone = 'Etc/UTC';
    const timezoneName = this.adAccount.timezoneName ? this.adAccount.timezoneName : defaultTimezone;
    this.adAccountControl.setValue({ ...this.adAccount, timezoneName });
  }

  private initStartDatePicker(): void {
    this.startPicker = new Litepicker(this.getLitePickerOptions(this.startPickerInner.nativeElement)).on(
      'selected',
      (date) => {
        this.startDate = date.dateInstance;
      },
    );
    this.startPicker.setDate(this.startDate);
  }

  private initEndDatePicker(): void {
    this.endPicker = new Litepicker(this.getLitePickerOptions(this.endPickerInner.nativeElement)).on(
      'selected',
      (date) => {
        this.endDate = date?.dateInstance;
      },
    );
    this.endPicker.setDate(this.endDate);
  }

  private getLitePickerOptions(element: ElementRef): any {
    return {
      element: element,
      inlineMode: false,
      format: 'MMM D, YYYY',
      autoApply: true,
      minDate: utcToZonedTime(endOfYesterday(), this.adAccount.timezoneName),
      dropdowns: { minYear: 2006, maxYear: null, months: true, years: true },
    };
  }

  private listenOnBudgetTypeChangesAndUpdateDayPartingAndEndDate(): void {
    this.subSink.sink = this.budgetForm.controls.budgetType.valueChanges.subscribe((change) => {
      if (change === BudgetType.DAILY) {
        this.budgetForm.controls.useDayparting?.setValue(false);
        this.endPicker.clearSelection();
        this.endDate = null;
        this.endTime = null;
      }
      if (change === BudgetType.LIFETIME) {
        this.endPicker.setDate(startOfTomorrow());
        this.endDate = startOfTomorrow();
        const timeNow = add(concatTimeStringToDate(this.endDate, this.range.get('startTime').value) ?? new Date(), {
          minutes: 10,
        });
        this.endTime = `${`0${timeNow.getHours()}`.substr(-2)}:${`0${timeNow.getMinutes()}`.substr(-2)}`;
      }
    });
  }

  private updateStartDateMinutesWhenInThePast(): void {
    this.subSink.sink = interval(CampaignScheduleComponent.UPDATE_TIME_INTERVAL).subscribe(() => {
      this.updateStartTimeAccordinglyToTimezone();
    });
  }

  private updateStartTimeAccordinglyToTimezone(): void {
    const startTimeControl = this.range.get('startTime');
    const adAccountTime = utcToZonedTime(new Date(), this.adAccount.timezoneName);
    const desiredTime = add(adAccountTime, { minutes: 1 });
    if (compareAsc(adAccountTime, concatTimeStringToDate(parseISO(this.startDate), startTimeControl.value)) >= 1) {
      startTimeControl.setValue(
        `${`0${desiredTime.getHours()}`.substr(-2)}:${`0${desiredTime.getMinutes()}`.substr(-2)}`,
      );
    }
  }
}
