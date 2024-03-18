import { TestBed } from '@angular/core/testing';
import { ModalService } from '@audience-app/global/services/modal/modal.service';

import { UserHasSubscriptionGuard } from './user-has-subscription.guard';

describe('UserHasSubscriptionGuard', () => {
  let guard: UserHasSubscriptionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ModalService, useValue: { closeModal: () => {} } }],
    });
    guard = TestBed.inject(UserHasSubscriptionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
