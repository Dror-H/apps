import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Component, Input } from '@angular/core';
import { UserSubscriptionContainerComponent } from '@audience-app/pages/user-dashboard-page/user-subscription-container/user-subscription-container.component';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@audience-app/store/user.state';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'ingo-user-subscription',
  template: '',
})
class MockUserSubscriptionComponent {
  @Input() userInfo;
}

describe('UserSubscriptionContainerComponent', () => {
  let component: UserSubscriptionContainerComponent;
  let fixture: ComponentFixture<UserSubscriptionContainerComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [UserSubscriptionContainerComponent, MockUserSubscriptionComponent],
      imports: [NzGridModule, NgxsModule.forRoot([UserState]), NgxsSelectSnapshotModule, NzModalModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserSubscriptionContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
