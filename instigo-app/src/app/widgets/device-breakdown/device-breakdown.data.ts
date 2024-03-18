import { customTooltips } from '../shared/custom-tooltips';
import { ChartOptions } from 'chart.js';

export const pieChartOptions = {
  cutoutPercentage: 70,
  maintainAspectRatio: true,
  responsive: true,
  legend: {
    display: false,
    position: 'bottom',
  },
  animation: {
    animateScale: true,
    animateRotate: true,
  },
  tooltips: {
    mode: 'label',
    intersect: false,
    position: 'average',
    enabled: false,
    custom: customTooltips,
  },
} as ChartOptions;

export const legendOptions = {
  '13-17': {
    label: '13-17',
    colour: '#fcba03',
  },
  '18-24': {
    label: '18-24',
    colour: '#20C997',
  },
  '25-34': {
    label: '25-34',
    colour: '#5F63F2',
  },
  '35-44': {
    label: '35-44',
    colour: '#FA8B0C',
  },
  '45-54': {
    label: '45-54',
    colour: '#0260f7',
  },
  '55-64': {
    label: '55-64',
    colour: '#f75002',
  },
  '65+': {
    label: '65+',
    colour: '#20C997',
  },
  male: {
    label: 'Male',
    colour: '#20C997',
  },
  female: {
    label: 'Female',
    colour: '#5F63F2',
  },
  unknown: {
    label: 'Unknown',
    colour: '#FA8B0C',
  },
  desktop: {
    label: 'Desktop',
    colour: '#20C997',
  },
  mobile_app: {
    label: 'Mobile App',
    colour: '#5F63F2',
  },
  mobile_web: {
    label: 'Mobile Web',
    colour: '#FA8B0C',
  },
  mobile: {
    label: 'Mobile',
    colour: '#0260f7',
  },
};
