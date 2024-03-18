import { StripeModule } from '@golevelup/nestjs-stripe';
import { MockRepository, userMock } from '@instigo-app/api-shared';
import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
describe('InvoiceService Test suite', () => {
  let service: InvoiceService;
  let userRepository: any;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        StripeModule.forRoot(StripeModule, {
          apiKey: '123',
        }),
      ],
      providers: [
        { provide: 'MailerService', useValue: { sendMail: jest.fn().mockResolvedValue({}) } },
        { provide: 'UserRepository', useValue: new MockRepository() },
        InvoiceService,
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    userRepository = module.get<any>('UserRepository');
    mailerService = module.get('MailerService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send invoice finalized', async () => {
    const user = userMock();
    const event = {
      data: {
        object: {
          id: 'in_1JkQnBKlYpB2IMP7ompl2lfb',
          object: 'invoice',
          account_country: 'AT',
          account_name: 'Insticore',
          amount_due: 2000,
          amount_remaining: 2000,
          customer: 'cus_KPFHouRT5PfLHk',
          lines: [
            {
              prod: 'prod_KGIb3Cm3ThJEcd',
            },
          ],
          invoice_pdf:
            // eslint-disable-next-line max-len
            'https://pay.stripe.com/invoice/acct_1DFfAoKlYpB2IMP7/test_YWNjdF8xREZmQW9LbFlwQjJJTVA3LF9LUEZIbGM3WmU3QkFjUVh2Y2k5dFZqM0FOMUtlUFdN0100YV0pJneh/pdf',
        },
      },
    } as any;
    const expected = {
      context: {
        name: user.fullName,
        invoice_url: event.data.object.invoice_pdf,
      },
      subject: 'New Invoice Ready - Instigo',
      template: 'new-invoice',
      to: user.email,
    };
    userRepository.findOne = jest.fn().mockResolvedValue(user);
    void (await service.invoiceFinalized(event));
    expect(mailerService.sendMail).toHaveBeenCalled();
    expect(mailerService.sendMail).toHaveBeenCalledWith(expected);
  });

  it('should send invoice failed', async () => {
    const user = userMock();
    const event = {
      data: {
        object: {
          id: 'in_1JkQnBKlYpB2IMP7ompl2lfb',
          object: 'invoice',
          account_country: 'AT',
          account_name: 'Insticore',
          amount_due: 2000,
          amount_remaining: 2000,
          customer: 'cus_KPFHouRT5PfLHk',
          lines: [
            {
              prod: 'prod_KGIb3Cm3ThJEcd',
            },
          ],
          invoice_pdf:
            // eslint-disable-next-line max-len
            'https://pay.stripe.com/invoice/acct_1DFfAoKlYpB2IMP7/test_YWNjdF8xREZmQW9LbFlwQjJJTVA3LF9LUEZIbGM3WmU3QkFjUVh2Y2k5dFZqM0FOMUtlUFdN0100YV0pJneh/pdf',
        },
      },
    } as any;
    const expected = {
      context: {
        name: user.fullName,
        invoice_url: event.data.object.invoice_pdf,
      },
      subject: 'Payment failed - Instigo',
      template: 'payment-failed',
      to: user.email,
    };
    userRepository.findOne = jest.fn().mockResolvedValue(user);
    void (await service.handleInvoiceFailed(event));
    expect(mailerService.sendMail).toHaveBeenCalled();
    expect(mailerService.sendMail).toHaveBeenCalledWith(expected);
  });
});
