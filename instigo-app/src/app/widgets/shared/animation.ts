import { animate, style, transition, trigger } from '@angular/animations';

export const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ transform: 'translateY(20vh)', opacity: '0' }),
    animate('1000ms cubic-bezier(.61, .29, .07, 1.02)'),
  ]),
]);
