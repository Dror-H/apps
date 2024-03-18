import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ValidatorApiService } from './validator-api.service';

describe('ValidatorApiService', () => {
  let asyncValidatorService: ValidatorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValidatorApiService],
    });

    asyncValidatorService = TestBed.inject(ValidatorApiService);
  });

  it('should be defined', () => {
    expect(asyncValidatorService).toBeDefined();
  });
});
