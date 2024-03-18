import { Test } from '@nestjs/testing';
import { ValidationService } from '@api/validation/service/validation.service';
import { HttpModule } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

describe('Validation', () => {
  let validationService: ValidationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ValidationService],
    }).compile();

    validationService = moduleRef.get<ValidationService>(ValidationService);
  });

  it('should return true', async () => {
    jest.spyOn((validationService as any).http, 'get').mockReturnValue(of({ data: 'something' }));
    expect(await validationService.pingUrl('https://facebook.com')).toBe(true);
  });

  it('should return false', async () => {
    jest.spyOn((validationService as any).http, 'get').mockReturnValue(throwError('something'));
    expect(await validationService.pingUrl('https://facebook.com')).toBe(false);
  });
});
