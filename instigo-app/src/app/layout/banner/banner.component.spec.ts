import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationApiService } from '@app/api/services/notification-api.service';
import { EMPTY } from 'rxjs';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [
        { provide: NzNotificationService, useValue: { create: () => EMPTY } },
        {
          provide: NotificationApiService,
          useValue: { notifications: () => EMPTY, bannerNotifications: () => EMPTY },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
