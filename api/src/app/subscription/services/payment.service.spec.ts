import { StripeModule } from '@golevelup/nestjs-stripe';
import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { PaymentService } from './payment.service';

describe('Payment Test suite', () => {
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        StripeModule.forRoot(StripeModule, {
          apiKey: '123',
        }),
      ],
      providers: [PaymentService, { provide: 'UserRepository', useValue: new MockRepository() }],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });
});
