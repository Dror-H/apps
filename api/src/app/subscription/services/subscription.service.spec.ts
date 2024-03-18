import { StripeModule } from '@golevelup/nestjs-stripe';
import { MockRepository, userMock } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { SubscriptionService } from './subscription.service';
const stripeSubscription = {
  id: 'sub_1Jf7BWKlYpB2IMP7vWM2pUOh',
  object: 'subscription',
  application_fee_percent: null,
  automatic_tax: {
    enabled: false,
  },
  billing_cycle_anchor: 1633039200,
  billing_thresholds: null,
  cancel_at: null,
  cancel_at_period_end: false,
  canceled_at: null,
  collection_method: 'charge_automatically',
  created: 1632938834,
  current_period_end: 1633039200,
  current_period_start: 1632938834,
  customer: 'cus_KJkeW5VmQDpYCA',
  days_until_due: null,
  default_payment_method: null,
  default_source: null,
  default_tax_rates: [],
  discount: null,
  ended_at: null,
  items: {
    object: 'list',
    data: [
      {
        id: 'si_KJkgnL0Cs6l6UM',
        object: 'subscription_item',
        billing_thresholds: null,
        created: 1632938834,
        metadata: {},
        plan: {
          id: 'price_1JewjrKlYpB2IMP7GTT1OKMv',
          object: 'plan',
          active: true,
          aggregate_usage: null,
          amount: null,
          amount_decimal: null,
          billing_scheme: 'tiered',
          created: 1632898679,
          currency: 'usd',
          interval: 'month',
          interval_count: 1,
          livemode: false,
          metadata: {},
          nickname: null,
          product: 'prod_KGIb3Cm3ThJEcd',
          tiers_mode: 'volume',
          transform_usage: null,
          trial_period_days: null,
          usage_type: 'licensed',
        },
        price: {
          id: 'price_1JewjrKlYpB2IMP7GTT1OKMv',
          object: 'price',
          active: true,
          billing_scheme: 'tiered',
          created: 1632898679,
          currency: 'usd',
          livemode: false,
          lookup_key: null,
          metadata: {},
          nickname: null,
          product: 'prod_KGIb3Cm3ThJEcd',
          recurring: {
            aggregate_usage: null,
            interval: 'month',
            interval_count: 1,
            trial_period_days: null,
            usage_type: 'licensed',
          },
          tax_behavior: 'unspecified',
          tiers_mode: 'volume',
          transform_quantity: null,
          type: 'recurring',
          unit_amount: null,
          unit_amount_decimal: null,
        },
        quantity: 1,
        subscription: 'sub_1Jf7BWKlYpB2IMP7vWM2pUOh',
        tax_rates: [],
      },
    ],
    has_more: false,
    total_count: 1,
    url: '/v1/subscription_items?subscription=sub_1Jf7BWKlYpB2IMP7vWM2pUOh',
  },
  latest_invoice: 'in_1Jf7BWKlYpB2IMP708aJ6Eyd',
  livemode: false,
  metadata: {
    user: 'lupu60@gmail.com',
    workspace: '336f821a-9217-46bb-9e7a-e7ca9e8f3036',
  },
  next_pending_invoice_item_invoice: null,
  pause_collection: null,
  payment_settings: {
    payment_method_options: null,
    payment_method_types: null,
  },
  pending_invoice_item_interval: null,
  pending_setup_intent: null,
  pending_update: null,
  plan: {
    id: 'price_1JewjrKlYpB2IMP7GTT1OKMv',
    object: 'plan',
    active: true,
    aggregate_usage: null,
    amount: null,
    amount_decimal: null,
    billing_scheme: 'tiered',
    created: 1632898679,
    currency: 'usd',
    interval: 'month',
    interval_count: 1,
    livemode: false,
    metadata: {},
    nickname: null,
    product: 'prod_KGIb3Cm3ThJEcd',
    tiers_mode: 'volume',
    transform_usage: null,
    trial_period_days: null,
    usage_type: 'licensed',
  },
  quantity: 1,
  schedule: null,
  start_date: 1632938834,
  status: 'active',
  transfer_data: null,
  trial_end: null,
  trial_start: null,
};
describe('Subscription Test suite', () => {
  let service: SubscriptionService;
  let userRepository: Repository<any>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        StripeModule.forRoot(StripeModule, {
          apiKey: '123',
        }),
      ],
      providers: [
        { provide: 'Connection', useValue: new MockRepository() },
        { provide: 'SubscriptionRepository', useValue: new MockRepository() },
        { provide: 'MailerService', useValue: { sendMail: jest.fn().mockResolvedValue({}) } },
        { provide: 'AdSpendService', useValue: { userAdSpend: jest.fn().mockResolvedValue({ total: 100 }) } },
        { provide: 'UserRepository', useValue: new MockRepository() },
        SubscriptionService,
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    userRepository = module.get<Repository<any>>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create customer', async () => {
    // Arrange
    const customer = {
      id: 'cus_KGjEQgjxBxlXpa',
      object: 'customer',
      name: 'Bogdan Lupu',
    };
    const user = userMock();
    userRepository.findOne = jest.fn().mockResolvedValue(user);
    userRepository.update = jest.fn().mockResolvedValue(user);
    (service as any).stripeService.customers.list = jest.fn().mockResolvedValue({ data: [] });
    (service as any).stripeService.customers.create = jest.fn().mockResolvedValue(customer);
    jest.spyOn(service as any, 'createCustomer');
    // Act
    const result = await service.findOrCreateCustomer({ user });

    // Assert
    expect(result.data).toMatchSnapshot();
    expect((service as any).createCustomer).toHaveBeenCalled();
  });

  it('should find customer', async () => {
    // Arrange
    const customer = {
      id: 'cus_KGjEQgjxBxlXpa',
      object: 'customer',
      name: 'Bogdan Lupu',
    };
    const user = { ...userMock(), stripeCustomerId: customer.id };
    userRepository.findOne = jest.fn().mockResolvedValue(user);
    (service as any).stripeService.customers.list = jest.fn().mockResolvedValue({ data: [customer] });
    userRepository.update = jest.fn().mockResolvedValue(user);

    // Act
    const result = await service.findOrCreateCustomer({ user });

    // Assert
    expect(result.data).toMatchSnapshot();
  });

  xit('should get subscription data', async () => {
    const user = userMock();
    const subscription = stripeSubscription;
    const data = await (service as any).subscriptionData({ user, subscription });
    expect(data).toMatchSnapshot();
  });

  xit('should return Trial Expired subscription', async () => {
    const user = userMock();
    const data = await (service as any).subscriptionData({ user, subscription: {} });
    expect(data).toMatchSnapshot();
  });

  xit('should return Trial subscription', async () => {
    const user = { ...userMock(), createdAt: new Date() };
    const data = await (service as any).subscriptionData({ user, subscription: {} });
    expect(data).toMatchSnapshot();
  });
});
