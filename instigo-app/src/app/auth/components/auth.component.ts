import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  animations: [
    trigger('routerTransition', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', opacity: 1, top: '50%', transform: 'translateY(-50%)' }), {
          optional: true,
        }),
        group([
          query(':enter', [style({ opacity: 0 }), animate('600ms ease-in-out', style({ opacity: 1 }))], {
            optional: true,
          }),
          query(':leave', [style({ opacity: 1 }), animate('600ms ease-in-out', style({ opacity: 0 }))], {
            optional: true,
          }),
        ]),
      ]),
    ]),
  ],
})
export class AuthComponent implements OnDestroy {
  isRegister$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  isForgotPassword$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  subsink = new SubSink();

  constructor(private router: Router) {
    this.subsink.sink = router.events.pipe().subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.isRegister$.next(url.includes('register'));
        this.isForgotPassword$.next(url.includes('send-reset-password'));
      }
    });
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }
}
