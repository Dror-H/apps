import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetType } from '@instigo-app/data-transfer-object';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { TranslateModule } from '@ngx-translate/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CampaignScheduleComponent } from './campaign-schedule.component';
import { ErrorMessagePipe } from './error-message.pipe';
import { TimeZoneDisplayPipe } from './time-zone-display.pipe';

function getMinutesFromTime(time: string): number {
  const fractions = time.split(':');
  let hours = parseInt(fractions[0], 10);
  hours = hours > 12 ? hours - 12 : hours;
  return hours * 60 + parseInt(fractions[1], 10);
}

describe('CampaignScheduleComponent', () => {
  let fixture: ComponentFixture<CampaignScheduleComponent>;
  let component: CampaignScheduleComponent;
  const timeNow = new Date('2021-12-07');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignScheduleComponent, ErrorMessagePipe, TimeZoneDisplayPipe],
      imports: [
        TranslateModule.forRoot(),
        CommonModule,
        ReactiveFormsModule,
        UiSharedModule,
        NzFormModule,
        NzInputModule,
        NzAlertModule,
      ],
    });

    fixture = TestBed.createComponent(CampaignScheduleComponent);
    component = fixture.componentInstance;

    const parentForm = new FormGroup({
      budgetSettings: new FormGroup({
        range: new FormGroup({
          startDate: new FormControl(timeNow),
          startTime: new FormControl(
            `${`0${timeNow.getHours()}`.substr(-2)}:${`0${timeNow.getMinutes()}`.substr(-2)}`,
            [Validators.pattern('[0-2][0-9]:[0-6][0-9]')],
          ),
          endDate: new FormControl(null),
          endTime: new FormControl(null, [Validators.pattern('[0-2][0-9]:[0-6][0-9]')]),
        }),
        budgetType: new FormControl(BudgetType.DAILY, [Validators.required]),
      }),
      settings: new FormGroup({
        account: new FormControl({}),
      }),
    });
    component.budgetForm = parentForm.get('budgetSettings') as FormGroup;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should initialize everything', () => {
    component.ngOnInit();
    expect(component.budgetForm.value.budgetType).toEqual('daily');
  });

  it('should initialize everything', () => {
    component.ngOnInit();
    const differenceInMinutes = timeNow.getTimezoneOffset();
    expect(getMinutesFromTime(component.budgetForm.value.range.startTime)).toEqual(Math.abs(differenceInMinutes));
    expect(component.budgetForm.value.range.startDate).toEqual(new Date('2021-12-07T00:00:00.000Z'));
  });
});
