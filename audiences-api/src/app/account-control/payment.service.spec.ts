import { StripeModule } from '@golevelup/nestjs-stripe';
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
      providers: [
        PaymentService,
        { provide: 'PrismaService', useValue: {} },
        { provide: 'CustomerService', useValue: {} },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });
});
