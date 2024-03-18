import { TestBed } from '@angular/core/testing';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule, Store } from '@ngxs/store';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), NgxsSelectSnapshotModule],
      providers: [
        { provide: AnalyticsService, useValue: {} },
        { provide: Angulartics2GoogleTagManager, useValue: {} },
      ],
    });
    service = TestBed.inject(AnalyticsService);
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue('anyUserId'); // same here
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
