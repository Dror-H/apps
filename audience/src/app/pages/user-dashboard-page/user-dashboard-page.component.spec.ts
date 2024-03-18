import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { currentUserMock } from '@audience-app/auth/auth.mocks';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { UserDashboardControlCardUserInfo, UserDashboardControlListItem } from '@instigo-app/ui/shared';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { Store } from '@ngxs/store';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { UserDashboardPageComponent } from './user-dashboard-page.component';

@Component({
  selector: 'ingo-user-dashboard-control-card',
  template: `<div></div>`,
})
export class MockUserDashboardControlCardComponent {
  @Input() user: UserDashboardControlCardUserInfo;
  @Input() listItems: UserDashboardControlListItem;
  @Output() logout = new EventEmitter();
}

describe('UserDashboardPageComponent', () => {
  let component: UserDashboardPageComponent;
  let fixture: ComponentFixture<UserDashboardPageComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDashboardPageComponent, MockUserDashboardControlCardComponent],
      imports: [StoreTestBedModule.configureTestingModule([]), RouterTestingModule, NzGridModule, NzAffixModule],
      providers: [{ provide: AuthService, useValue: { logout: () => {} } }],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    store.reset({ user: currentUserMock });
    fixture = TestBed.createComponent(UserDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
