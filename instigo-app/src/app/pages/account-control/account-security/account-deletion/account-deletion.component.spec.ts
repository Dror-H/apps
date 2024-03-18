import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserApiService } from '@app/api/services/user.api.service';
import { DisplayNotification } from '@app/global/display-notification.service';
import { LogoutService } from '@app/global/logout.service';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule } from '@ngxs/store';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AccountDeletionComponent } from './account-deletion.component';

describe('AccountDeletionComponent: ', () => {
  let component: AccountDeletionComponent;
  let fixture: ComponentFixture<AccountDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        NgxsSelectSnapshotModule,
        NzCollapseModule,
        NzCardModule,
        NzModalModule,
        NoopAnimationsModule,
      ],
      declarations: [AccountDeletionComponent],
      providers: [
        { provide: UserApiService, useValue: {} },
        { provide: LogoutService, useValue: {} },
        { provide: LogoutService, useValue: {} },
        { provide: DisplayNotification, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
