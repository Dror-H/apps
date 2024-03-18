import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { UpdateUser, UserState } from '@app/global/user.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { User } from '@instigo-app/data-transfer-object';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Select(UserState.get)
  public user$: Observable<User>;

  public isCollapsed = false;
  public sidebarColorScheme = 'default';
  public headerColorScheme = 'light';
  public isThemeSwitcherActive = false;

  @Select(UserState.layoutSettings)
  private layoutSettings: Observable<any>;

  private subscription = new SubSink();

  constructor(private store: Store, private router: Router, private displayNotification: DisplayNotification) {}

  ngOnInit(): void {
    this.subscription.sink = this.store
      .select(WorkspaceState.totalAdAccounts)
      .subscribe((numberOfAdAccounts: number) => {
        const noAdAccountUrl = '/no-adaccount';
        if (numberOfAdAccounts == 0) {
          void this.router.navigateByUrl(noAdAccountUrl);
        } else if (this.router.url === noAdAccountUrl) {
          void this.router.navigateByUrl('/dashboard/workspace');
        }
      });

    this.subscription.sink = this.layoutSettings.subscribe((settings: any) => {
      this.headerColorScheme = settings ? settings.headerStyle : 'default';
      this.sidebarColorScheme = settings ? settings.sidebarStyle : 'dark';
    });
    this.getScrollbarWidth();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public isMenuCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  @Dispatch()
  public updateSettings() {
    const payload = {
      settings: {
        headerStyle: this.headerColorScheme,
        sidebarStyle: this.sidebarColorScheme,
      },
    };
    return new UpdateUser(payload);
  }

  private getScrollbarWidth() {
    const outer = document.createElement('div') as any;
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    const body = document.querySelector('body');
    const styleEl = document.createElement('style') as HTMLElement;
    const css = document.createTextNode(`:root { --layout-scrollbar-width: ${scrollbarWidth}px;}`);
    styleEl.appendChild(css);
    (body as HTMLElement).appendChild(styleEl);
  }

  public detected(isDetected: any) {
    if (isDetected) {
      this.displayNotification.displayNotification(
        new Notification({
          titleId: `app.adBlockMessageTitle`,
          contentId: `app.adBlockMessage`,
          type: NotificationType.WARNING,
        }),
      );
    }
  }
}
