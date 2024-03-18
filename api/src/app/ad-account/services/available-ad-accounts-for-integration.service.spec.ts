import { MockRepository, UnableToFetchAdAccountsException } from '@instigo-app/api-shared';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as faker from 'faker';
import { AvailableAdAccountsForIntegrationService } from './available-ad-accounts-for-integration.service';

const platformAdAccounts = [
  {
    businessId: '2375989379092878',
    businessName: 'Lauder Business School',
    businessProfile:
      'https://scontent-vie1-1.xx.fbcdn.net/v/t1.0-1/p100x100/483845_390905817673739_1941766058_n.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_ohc=ncz-1o-9pRAAX-6ZL1-&_nc_ht=scontent-vie1-1.xx&_nc_tp=6&oh=7d8503904900c8db28396ec59da0bdb3&oe=5EC6B340',
    currency: 'EUR',
    providerId: 'act_37793603',
    name: 'Lauder Business School',
    provider: 'facebook',
    status: 1,
  },
  {
    businessId: 'act_283910791',
    businessName: 'Bogdan Wolf',
    businessProfile: '',
    currency: 'USD',
    providerId: 'act_283910791',
    name: 'Bogdan Wolf',
    provider: 'facebook',
    status: 1,
  },
];

const instigoAdAccounts = [
  {
    id: 'd2547a24-cba0-4a77-bdca-84c707d7fe3a',
    createdAt: '2020-03-10T11:42:13.290Z',
    updatedAt: '2020-03-10T11:42:13.341Z',
    name: 'Lauder Business School',
    provider: 'facebook',
    providerId: 'act_37793603',
    businessName: 'Lauder Business School',
    businessProfile:
      'https://scontent-vie1-1.xx.fbcdn.net/v/t1.0-1/p100x100/483845_390905817673739_1941766058_n.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_ohc=ncz-1o-9pRAAX-6ZL1-&_nc_ht=scontent-vie1-1.xx&_nc_tp=6&oh=7d8503904900c8db28396ec59da0bdb3&oe=5EC6B340',
    businessId: '2375989379092878',
    status: 1,
    workspace: {
      id: 'd2547a24-cba0-4a77-bdca-84c707d7fer4',
      name: 'test',
      description: 'test workspace',
      disabled: false,
    },
  },
];

const expectedIntersection = [
  {
    businessId: 'act_283910791',
    businessName: 'Bogdan Wolf',
    businessProfile: '',
    currency: 'USD',
    providerId: 'act_283910791',
    name: 'Bogdan Wolf',
    provider: 'facebook',
    status: 1,
    used: false,
  },
  {
    id: 'd2547a24-cba0-4a77-bdca-84c707d7fe3a',
    createdAt: '2020-03-10T11:42:13.290Z',
    updatedAt: '2020-03-10T11:42:13.341Z',
    name: 'Lauder Business School',
    provider: 'facebook',
    providerId: 'act_37793603',
    businessName: 'Lauder Business School',
    businessProfile:
      'https://scontent-vie1-1.xx.fbcdn.net/v/t1.0-1/p100x100/483845_390905817673739_1941766058_n.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_ohc=ncz-1o-9pRAAX-6ZL1-&_nc_ht=scontent-vie1-1.xx&_nc_tp=6&oh=7d8503904900c8db28396ec59da0bdb3&oe=5EC6B340',
    businessId: '2375989379092878',
    status: 1,
    workspace: {
      id: 'd2547a24-cba0-4a77-bdca-84c707d7fer4',
      name: 'test',
      description: 'test workspace',
      disabled: false,
    },
    used: true,
  },
];

describe('AvailableAdAccountsForIntegrationService Test suite', () => {
  let service: AvailableAdAccountsForIntegrationService;
  let thirdPartyAdAccountApiService;
  let adAccountRepository;
  let pageRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AvailableAdAccountsForIntegrationService,
        { provide: 'AdAccountRepository', useValue: new MockRepository() },
        { provide: 'ThirdPartyAdAccountApiService', useValue: {} },
        { provide: 'PageRepository', useValue: new MockRepository() },
      ],
    }).compile();

    service = module.get<AvailableAdAccountsForIntegrationService>(AvailableAdAccountsForIntegrationService);
    thirdPartyAdAccountApiService = module.get('ThirdPartyAdAccountApiService');
    adAccountRepository = module.get('AdAccountRepository');
    pageRepository = module.get('AdAccountRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const user = {
    id: '3cd63989-b2e7-4da8-8bc0-3c8ea82bb804',
    username: 'wolf',
    firstName: 'Bogdan',
    lastName: 'Wolf',
    email: 'lupu60@gmail.com',
    phone: null,
    isActive: true,
    emailVerification: false,
    onboarding: { completed: true },
    roles: ['USER'],
    oAuthTokens: [
      {
        id: 'ea7e9ca6-d518-4243-9dae-006d62ba521e',
        provider: 'facebook',
        providerClientId: '3278437282186540',
        accessToken: 'token',
        refreshToken: null,
        expiresAt: null,
        tokenType: null,
        scope: 'authorizeApp',
        user: undefined,
      },
    ],
  } as any;

  const workspace = {
    id: 'randomid',
    owner: {
      getAccessToken: jest.fn().mockReturnValue('token'),
    },
  } as any;

  it('should return available AdAccounts with used flag on the used one', async () => {
    // Arrange
    thirdPartyAdAccountApiService.findAll = jest.fn().mockResolvedValue(platformAdAccounts);
    adAccountRepository.find = jest.fn().mockResolvedValue(instigoAdAccounts);
    service.getAccessToken = jest.fn().mockReturnValue('token');
    // Act
    const availableAdAccounts = await service.getAvailableAdAccounts({
      user,
      provider: SupportedProviders.FACEBOOK,
    });
    // Assert
    expect(availableAdAccounts).toEqual(expectedIntersection);
  });

  it('should throw an error for invalid token', async () => {
    // Arrange
    service.getAccessToken = jest.fn().mockResolvedValue('token');
    adAccountRepository.find = jest.fn().mockResolvedValue(instigoAdAccounts);
    const error = {
      error: {
        status: 401,
      },
    };
    thirdPartyAdAccountApiService.findAll = jest.fn().mockRejectedValue(error);
    // Assert
    await expect(service.getAvailableAdAccounts({ user, provider: SupportedProviders.FACEBOOK })).rejects.toEqual(
      new HttpException(`Invalid OauthToken for ${SupportedProviders.FACEBOOK}`, 401),
    );
  });

  it('should throw an error for unable to fetch ad accounts', async () => {
    // Arrange
    service.getAccessToken = jest.fn().mockResolvedValue('token');
    thirdPartyAdAccountApiService.findAll = jest.fn().mockResolvedValue(platformAdAccounts);
    adAccountRepository.find = jest.fn().mockRejectedValue(new Error(faker.hacker.abbreviation()));
    user.email = faker.internet.email();
    // Assert
    await expect(service.getAvailableAdAccounts({ user, provider: SupportedProviders.FACEBOOK })).rejects.toEqual(
      new UnableToFetchAdAccountsException({ email: user.email }),
    );
  });
});
