import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSelectoComponent } from 'ngx-selecto';
import { flatten } from 'lodash-es';

@Component({
  selector: 'ingo-dayparting',
  templateUrl: './dayparting.component.html',
  styleUrls: ['./dayparting.component.scss'],
})
export class DaypartingComponent implements OnInit, AfterViewInit {
  @Input()
  budgetSettingsForm = new FormGroup({});

  @ViewChild('scheduleGrid', { static: true })
  scheduleGrid: NgxSelectoComponent;

  public scheduleDays: any[] = [];
  private adSchedule = {
    monday: {
      hours: [],
    },
    tuesday: {
      hours: [],
    },
    wednesday: {
      hours: [],
    },
    thursday: {
      hours: [],
    },
    friday: {
      hours: [],
    },
    saturday: {
      hours: [],
    },
    sunday: {
      hours: [],
    },
  };

  private get adSetSchedule() {
    return this.budgetSettingsForm.get('adSetSchedule').value;
  }

  private set adSetSchedule(value) {
    this.budgetSettingsForm.get('adSetSchedule').setValue(value);
  }

  ngOnInit(): void {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${i < 10 ? '0' : ''}${i}:00`);
    }
    days.forEach((value) => {
      const day = { name: value, hours: hours };
      this.scheduleDays.push(day);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scheduleGrid = this.scheduleGrid.setSelectedTargets(this.getSelectedItems());
      this.scheduleGrid.getSelectedTargets().forEach((el: HTMLElement) => el.classList.add('selected'));
    });
  }

  public onSelectEnd(event): void {
    event.afterAdded.forEach((el) => {
      el.classList.add('selected');
    });
    event.afterRemoved.forEach((el) => {
      el.classList.remove('selected');
    });
    this.exactSelectedValues();
    this.adSetSchedule = this.adSchedule;
  }

  public onSelect(e): void {
    e.added.forEach((el) => {
      el.classList.add('selected');
    });
    e.removed.forEach((el) => {
      el.classList.remove('selected');
    });
  }

  public applyEntireHour(e: MouseEvent, hour: string): void {
    document.querySelectorAll(`.hour-${hour.substring(0, 2)}`).forEach((value, index) => {
      this.scheduleGrid.clickTarget(e, value);
    });
  }

  public applyEntireDay(e: MouseEvent, day: string): void {
    document.querySelectorAll(`.day-${day.toLowerCase()}`).forEach((value, index) => {
      this.scheduleGrid.clickTarget(e, value);
    });
  }

  private exactSelectedValues(): void {
    this.resetAdScheduleObject();
    this.scheduleGrid.getSelectedTargets().forEach((element: HTMLElement) => {
      const day = element.attributes[2].nodeValue;
      const hour = element.attributes[3].nodeValue;
      this.adSchedule[day].hours.push(hour);
    });
  }

  private resetAdScheduleObject(): void {
    Object.entries(this.adSchedule).forEach(([, value]) => (value.hours = []));
  }

  private getSelectedItems(): HTMLElement[] {
    return flatten(
      Object.entries(this.adSetSchedule)
        .map(([key, value]: [key: string, value: { hours: string[] }]) => ({ day: key, hours: value.hours }))
        .map((item) => item.hours.map((hour) => ({ day: item.day, hour }))),
    ).map((item) => document.querySelector(`div.cube.day-${item.day}.hour-${item.hour}.ng-star-inserted`));
  }
}
