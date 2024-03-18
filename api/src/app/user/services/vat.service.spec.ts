import { Test } from '@nestjs/testing';
import { VatService } from './vat.service';

describe('Vat Test suite', () => {
  let vatService: VatService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VatService],
    }).compile();

    vatService = module.get<VatService>(VatService);
  });

  it('should be defined', () => {
    expect(vatService).toBeDefined();
  });
});
