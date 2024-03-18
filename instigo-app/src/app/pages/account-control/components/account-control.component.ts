import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-account-control',
  templateUrl: './account-control.component.html',
  styleUrls: ['./account-control.component.scss'],
})
export class AccountControlComponent implements OnInit {
  breadcrumb$ = new BehaviorSubject<any>({});
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.breadcrumb$.next(this.route.snapshot.firstChild.data);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.breadcrumb$.next(this.route.snapshot.firstChild.data));
  }
}
