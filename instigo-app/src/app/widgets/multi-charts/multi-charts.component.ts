import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartType } from './multi-charts.model';
import {
  impressionsData,
  likesData,
  pageLikesData,
  adClicksData,
  loadNewData,
  randomizeCards,
} from './multi-charts.data';

@Component({
  selector: 'ingo-widget-multi-charts',
  templateUrl: './multi-charts.component.html',
  styleUrls: ['./multi-charts.component.scss'],
})
export class MultiChartsComponent implements OnInit {
  rangeText: string;

  impressionsData: ChartType;
  likesData: ChartType;
  pageLikesData: ChartType;
  adClicksData: ChartType;

  public chart1 = impressionsData;
  public chart2 = likesData;
  public chart3 = pageLikesData;
  public chart4 = adClicksData;

  activeRange: string;
  ranges = [
    {
      label: 'labelsDay',
      text: 'Day',
    },
    {
      label: 'labelsWeek',
      text: 'Week',
    },
    {
      label: 'labelsMonth',
      text: 'Month',
    },
    {
      label: 'labelsYear',
      text: 'Year',
    },
  ];

  items = [
    {
      type: 'impression',
      chart: this.chart1,
      compare: 14.2,
      icon: 'up',
      metric: 'Spent',
      total: '23,782',
      totalLast: '20,192',
    },
    {
      type: 'likes',
      chart: this.chart2,
      compare: 11.92,
      icon: 'up',
      metric: 'People Reached',
      total: '23,782',
      totalLast: '20,192',
    },
    {
      type: 'page-likes',
      chart: this.chart3,
      compare: 7.82,
      icon: 'down',
      metric: 'ROAS',
      total: '28,211',
      totalLast: '18,482',
    },
    {
      type: 'ad-clicks',
      chart: this.chart4,
      compare: 18.3,
      icon: 'up',
      metric: 'Ad Clicks',
      total: '13,392',
      totalLast: '11,485',
    },
  ];
  constructor() {}

  ngOnInit() {
    this.activeRange = 'labelsDay';
    this.rangeText = 'Oct 21, 2020';
  }
  changeModel(timeframe: string) {
    this.activeRange = timeframe;
    this.rangeText =
      timeframe === 'labelsDay'
        ? 'Oct 21, 2020'
        : timeframe === 'labelsWeek'
        ? 'Oct 14, 2020 - Oct 21, 2020'
        : timeframe === 'labelsMonth'
        ? 'Sep 21, 2020 - Oct 21, 2020'
        : 'Oct 21, 2019 - Oct 21, 2020';
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].compare = (Math.floor(Math.random() * 35) + 10) / 10;
      this.items[i].icon = this.items[i].icon === 'up' ? 'down' : 'up';
      this.items[i].chart = loadNewData(this.items[i].chart, timeframe);
      this.items[i].chart.datasets[0].data = randomizeCards();
    }
  }
}
