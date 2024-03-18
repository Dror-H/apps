import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LogoutService } from '@app/global/logout.service';
import { UserbackService } from '@app/shared/analytics/userback.service';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule, Store } from '@ngxs/store';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzElementPatchModule } from 'ng-zorro-antd/core/element-patch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-quick-nav',
  template: `<div></div>`,
})
class MockQuickNavComponent {}

@Component({
  selector: 'instigo-app-notification-dropdown',
  template: `<div></div>`,
})
class MockNotificationDrowdownComponent {}

@Directive({
  selector: '[featureToggle]',
})
class FeatureToggleMockDirective {
  @Input() featureToggle: string;
}

describe('HeaderComponent: ', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: Store;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        FeatureToggleMockDirective,
        MockQuickNavComponent,
        MockNotificationDrowdownComponent,
      ],
      imports: [
        NgxsModule.forRoot([]),
        NgxsSelectSnapshotModule,
        NzLayoutModule,
        NzPopoverModule,
        NzElementPatchModule,
        NzButtonModule,
        NzGridModule,
        NzIconModule,
        NzDropDownModule,
        NzAvatarModule,
        NzToolTipModule,
        NzTagModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: LogoutService, useValue: {} },
        { provide: UserbackService, useValue: {} },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'select').mockReturnValue(of({ pictureUrl: '' }));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
