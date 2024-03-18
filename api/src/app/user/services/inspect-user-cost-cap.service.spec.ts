import { Test } from '@nestjs/testing';
import { InspectUserCostCapService } from './inspect-user-cost-cap.service';
import { MockRepository, userMock, usersMock } from '@instigo-app/api-shared';

describe('InspectUserCostCap Test suite', () => {
  let service: InspectUserCostCapService;
  let userRepository: any;
  let adSpendService: any;
  let subscriptionService: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InspectUserCostCapService,
        { provide: 'AdSpendService', useValue: {} },
        { provide: 'UserRepository', useValue: new MockRepository() },
        { provide: 'EventEmitter', useValue: { emit: () => {} } },
        { provide: 'SubscriptionService', useValue: {} },
      ],
    }).compile();

    service = module.get<InspectUserCostCapService>(InspectUserCostCapService);
    userRepository = module.get<any>('UserRepository');
    adSpendService = module.get<any>('AdSpendService');
    subscriptionService = module.get<any>('SubscriptionService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should inspect cost cap and not upgrade', async () => {
    const users = usersMock({ no: 100 });
    service.notifyMembers = jest.fn();
    service.upgradeUserSubscription = jest.fn();
    userRepository.find = jest.fn().mockResolvedValue(users);
    adSpendService.userAdSpend = jest.fn().mockResolvedValue({ total: 100 });
    subscriptionService.getSubscription = jest.fn().mockResolvedValue({
      data: {
        id: 'sub_1JjPkVKlYpB2IMP7EDplRuGs',
        nextPayment: '11/10/2021',
        quantity: 1,
        billingCycle: 'monthly',
        latestInvoice: 'in_1JjPkVKlYpB2IMP7nzdEafxQ',
        planCost: 19,
        spendCap: 1,
        cancelAtPeriodEnd: false,
        price: 'price_1JhsLsKlYpB2IMP7IcF3IEjt',
        used: 0,
        status: '0',
        active: true,
        color: '#7ed321',
        label: 'Active',
      },
    });
    void (await service.inspectCostCap());
    expect(service.notifyMembers).toBeCalledTimes(0);
    expect(service.upgradeUserSubscription).toBeCalledTimes(0);
  });
  it('should inspect cost cap and upgrade', async () => {
    const users = usersMock({ no: 5 });
    service.notifyMembers = jest.fn();
    service.upgradeUserSubscription = jest.fn();
    userRepository.find = jest.fn().mockResolvedValue(users);
    adSpendService.userAdSpend = jest.fn().mockResolvedValue({ total: 1500 });
    subscriptionService.getSubscription = jest.fn().mockResolvedValue({
      data: {
        id: 'sub_1JjPkVKlYpB2IMP7EDplRuGs',
        nextPayment: '11/10/2021',
        quantity: 1,
        billingCycle: 'monthly',
        latestInvoice: 'in_1JjPkVKlYpB2IMP7nzdEafxQ',
        planCost: 19,
        spendCap: 1,
        cancelAtPeriodEnd: false,
        price: 'price_1JhsLsKlYpB2IMP7IcF3IEjt',
        used: 0,
        status: '0',
        active: true,
        color: '#7ed321',
        label: 'Active',
      },
    });
    void (await service.inspectCostCap());
    expect(service.notifyMembers).toBeCalledTimes(5);
    expect(service.upgradeUserSubscription).toBeCalledTimes(5);
  });
});
