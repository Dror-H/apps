import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PaymentsApiService } from '@app/api/services/payments.api.service';

describe('PaymentsApiService', () => {
  let service: PaymentsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsApiService],
    });
    service = TestBed.inject(PaymentsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
