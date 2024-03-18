import { Test } from '@nestjs/testing';
import { CampaignCreationService } from './campaign-creation.service';
import {
  ThirdPartyAdApiService,
  ThirdPartyAdSetApiService,
  ThirdPartyCampaignApiService,
} from '@instigo-app/third-party-connector';
import {
  adAccountMock,
  campaignDraftMock,
  CreationException,
  mockAdAccount,
  mockCampaign,
  MockRepository,
  StepFailure,
  userMock,
} from '@instigo-app/api-shared';
import * as faker from 'faker';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter2 } from 'eventemitter2';
import {
  CampaignCreationDTO,
  FacebookCampaignCreationDto,
  FacebookCampaignDraft,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { User } from '@api/user/data/user.entity';
import { ForbiddenException } from '@nestjs/common';
import to from 'await-to-js';
import { CampaignService } from '@api/campaign/services/campaign.service';

describe('CampaignCreationService Test suite', () => {
  const accessToken = faker.random.alphaNumeric() as string;
  const [adAccount] = mockAdAccount({ provider: 'facebook' });
  const campaignCreation = {
    name: 'new campaign',
    status: 'PAUSED',
    provider: 'facebook',
    providerSpecificFields: {
      objective: 'LINK_CLICKS',
      specialAdCategories: null,
      buyingType: 'auction',
      spendCap: null,
    },
    adAccount,
  } as CampaignCreationDTO<FacebookCampaignCreationDto>;
  const user = userMock();
  const [createCampaign] = mockCampaign({ provider: 'facebook' });

  // services
  let service: CampaignCreationService;
  let thirdPartyCampaignApiService: ThirdPartyCampaignApiService;
  let thirdPartyAdSetApiService: ThirdPartyAdSetApiService;
  let thirdPartyAdApiService: ThirdPartyAdApiService;
  let campaignRepository: Repository<any>;
  let adSetRepository: Repository<any>;
  let adRepository: Repository<any>;
  let mailerService: MailerService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CampaignCreationService,
        { provide: ThirdPartyCampaignApiService, useValue: {} },
        { provide: ThirdPartyAdSetApiService, useValue: {} },
        { provide: ThirdPartyAdApiService, useValue: {} },
        {
          provide: CampaignService,
          useValue: {
            createCampaign: () => Promise.resolve('createCampaign'),
            deleteCampaignDraft: () => Promise.resolve('deleted'),
            recordThroughInstigo: () => Promise.resolve('record'),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: () => {},
          },
        },
        { provide: MailerService, useValue: { sendMail: jest.fn().mockResolvedValue({}) } },
        { provide: 'ConfigService', useValue: { get: jest.fn() } },
        { provide: 'CampaignRepository', useValue: new MockRepository() },
        { provide: 'AdSetRepository', useValue: new MockRepository() },
        { provide: 'CampaignDraftRepository', useValue: new MockRepository() },
        { provide: 'AdRepository', useValue: new MockRepository() },
        { provide: 'CampaignThroughInstigoRecordRepository', useValue: new MockRepository() },
      ],
    }).compile();

    service = module.get<CampaignCreationService>(CampaignCreationService);
    thirdPartyCampaignApiService = module.get(ThirdPartyCampaignApiService);
    thirdPartyAdSetApiService = module.get(ThirdPartyAdSetApiService);
    thirdPartyAdApiService = module.get(ThirdPartyAdApiService);
    campaignRepository = module.get('CampaignRepository');
    adSetRepository = module.get('AdSetRepository');
    adRepository = module.get('AdRepository');
    mailerService = module.get(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new campaign', async () => {
    // Arrange
    thirdPartyCampaignApiService.create = jest.fn().mockResolvedValueOnce(createCampaign);
    campaignRepository.save = jest.fn().mockResolvedValueOnce(createCampaign);

    // Act
    const result = await (service as any).createCampaign({ campaign: campaignCreation, adAccount, accessToken });

    // Assert
    expect(thirdPartyCampaignApiService.create).toHaveBeenCalled();
    expect(thirdPartyCampaignApiService.create).toHaveBeenCalledWith({
      accessToken,
      adAccountProviderId: adAccount.providerId,
      provider: adAccount.provider,
      campaign: campaignCreation,
    });
    expect(result).toBeDefined();
  });

  it('should throwError  new campaign', async () => {
    // Arrange
    thirdPartyCampaignApiService.create = jest.fn().mockRejectedValue('Something went wrong');
    campaignRepository.save = jest.fn().mockResolvedValueOnce(createCampaign);

    // Act & Assert
    await expect(
      (service as any).createCampaign({ campaign: campaignCreation, adAccount, accessToken }),
    ).rejects.toThrow();
  });

  it('should create a new adSet', async () => {
    // Arrange
    thirdPartyAdSetApiService.create = jest.fn().mockResolvedValueOnce({});
    adSetRepository.save = jest.fn().mockResolvedValueOnce({});
    const payload = {
      accessToken,
      adSet: {},
      adAccount,
      campaign: createCampaign,
    };
    // Act
    const result = await (service as any).createAdSet(payload as any);

    // Assert
    expect(thirdPartyAdSetApiService.create).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throwError  new adSet', async () => {
    // Arrange
    const payload = {
      accessToken,
      adSet: {},
      adAccount,
      campaign: createCampaign,
    };
    thirdPartyAdSetApiService.create = jest.fn().mockRejectedValue('Something went wrong');
    adSetRepository.save = jest.fn().mockResolvedValueOnce({});

    let thrwonError;
    try {
      await (service as any).createAdSet(payload);
    } catch (err) {
      thrwonError = err;
    }

    // Act & Assert
    expect(thrwonError.response).toEqual({
      message: `Error while creating a facebook AD_SET on ${adAccount.name}`,
      provider: 'facebook',
      stepFailure: 'AD_SET',
      trace: 'Something went wrong',
    });
  });

  it('should create a new ads', async () => {
    // Arrange
    thirdPartyAdApiService.createMany = jest.fn().mockResolvedValueOnce([]);
    adRepository.save = jest.fn().mockResolvedValueOnce([]);
    const payload = {
      ads: [],
      accessToken,
      adSet: {},
      adAccount,
      campaign: createCampaign,
    };
    // Act
    const result = await (service as any).createAds(payload as any);

    // Assert
    expect(thirdPartyAdApiService.createMany).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throwError  new ads', async () => {
    // Arrange
    const payload = {
      ads: [],
      accessToken,
      adSet: {},
      adAccount,
      campaign: createCampaign,
    };
    thirdPartyAdApiService.createMany = jest.fn().mockRejectedValue('Something went wrong');
    adRepository.save = jest.fn().mockResolvedValueOnce({});

    // Act & Assert
    await expect((service as any).createAds(payload)).rejects.toThrow();
  });

  it('should try to rollback when adSet creation has failed', () => {
    // Arrange
    const payload = {
      payload: { campaign: { ...createCampaign, adAccount }, adSet: {}, ads: [] } as any,
      workspace: { owner: { getAccessToken: jest.fn().mockRejectedValue({ accessToken }) } },
      user: {},
    };
    thirdPartyCampaignApiService.create = jest.fn().mockResolvedValueOnce(createCampaign);
    campaignRepository.save = jest.fn().mockResolvedValueOnce(createCampaign);
    thirdPartyAdSetApiService.create = jest.fn().mockRejectedValue('Something went wrong');
    thirdPartyCampaignApiService.delete = jest.fn().mockResolvedValueOnce({});
    campaignRepository.delete = jest.fn().mockResolvedValueOnce({});

    // Act & Assert
    service.create(payload as any).catch(() => {
      expect((service as any).rollback).toHaveBeenCalled();
    });
  });

  it('should try to notify user when adSet creation has failed', async () => {
    // Arrange
    const options = {
      payload: campaignDraftMock,
      workspace: { owner: { getAccessToken: jest.fn().mockRejectedValue({ accessToken }) } },
      user,
    };
    thirdPartyCampaignApiService.create = jest.fn().mockResolvedValueOnce(options.payload.campaign);
    campaignRepository.save = jest.fn().mockResolvedValueOnce(options.payload.campaign);

    thirdPartyAdSetApiService.create = jest.fn().mockRejectedValue('Something went wrong');

    // mock rollback
    thirdPartyCampaignApiService.delete = jest.fn().mockResolvedValueOnce({});
    campaignRepository.delete = jest.fn().mockResolvedValueOnce({});

    const spy = jest.spyOn(mailerService, 'sendMail');

    // Act & Assert
    const [err] = await to(service.create(options as any));
    expect(err).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should try to rollback when ads creation has failed', () => {
    // Arrange
    const payload = {
      payload: { campaign: { ...createCampaign, adAccount }, adSet: {}, ads: [] } as any,
      workspace: { owner: { getAccessToken: jest.fn().mockRejectedValue({ accessToken }) } },
      user: {},
    };
    thirdPartyCampaignApiService.create = jest.fn().mockResolvedValueOnce(createCampaign);
    campaignRepository.save = jest.fn().mockResolvedValueOnce(createCampaign);
    thirdPartyAdSetApiService.create = jest.fn().mockResolvedValueOnce({});
    adSetRepository.save = jest.fn().mockResolvedValueOnce({});

    thirdPartyAdApiService.createMany = jest.fn().mockRejectedValue('Something went wrong');

    //rollback mock
    thirdPartyCampaignApiService.delete = jest.fn().mockResolvedValueOnce({});
    campaignRepository.delete = jest.fn().mockResolvedValueOnce({});

    // Act & Assert
    service.create(payload as any).catch(() => {
      expect((service as any).rollback).toHaveBeenCalled();
    });
  });

  it('campaign creation return error', async () => {
    const options = {
      payload: {
        campaign: {} as unknown as FacebookCampaignDraft,
        campaignDraftId: 'no-draft',
      },
      workspace: 'some worrkspace' as unknown as Workspace,
      user: 'nu-user' as unknown as Partial<User>,
    };
    (service as any).serializeCampaign = jest.fn().mockReturnValueOnce({ err: true });
    (service as any).notify = jest.fn().mockResolvedValue(true);
    try {
      await service.create(options);
    } catch (err) {
      expect(err).toStrictEqual(new ForbiddenException({ error: StepFailure.CAMPAIGN }));
    }
  });

  it('campaign creation return error in CAMPAIGN level', async () => {
    thirdPartyCampaignApiService.create = jest.fn().mockRejectedValue('Something went wrong');
    const workspaceMock = {
      owner: {
        getAccessToken: ({ provider }) => ({ accessToken: 'whatever access token' }),
      },
    };
    try {
      await service.create({ payload: campaignDraftMock as any, workspace: workspaceMock as any, user: {} as any });
    } catch (err) {
      expect(err).toStrictEqual(
        new CreationException({
          stepFailure: StepFailure.CAMPAIGN,
          adAccount: adAccountMock as any,
          provider: SupportedProviders.FACEBOOK,
          error: 'Something went wrong' as any,
        }),
      );
    }
  });

  it('campaign creation return error in AD_SET level', async () => {
    (service as any).createCampaign = jest.fn().mockResolvedValue(Promise.resolve('new campaign working'));
    thirdPartyAdSetApiService.create = jest.fn().mockRejectedValue('Something went wrong');
    (service as any).rollback = jest.fn();

    const workspaceMock = {
      owner: {
        getAccessToken: ({ provider }) => ({ accessToken: 'whatever access token' }),
      },
    };
    try {
      await service.create({ payload: campaignDraftMock as any, workspace: workspaceMock as any, user: {} as any });
    } catch (err) {
      expect(err).toStrictEqual(
        new CreationException({
          stepFailure: StepFailure.AD_SET,
          adAccount: adAccountMock as any,
          provider: SupportedProviders.FACEBOOK,
          error: 'Something went wrong' as any,
        }),
      );
    }
  });

  it('campaign creation return error in AD level', async () => {
    (service as any).createCampaign = jest.fn().mockResolvedValue(Promise.resolve('new campaign working'));
    (service as any).createAdSet = jest.fn().mockResolvedValue(Promise.resolve('new ad set'));
    thirdPartyAdApiService.createMany = jest.fn().mockRejectedValue('Something went wrong');
    (service as any).rollback = jest.fn();

    const workspaceMock = {
      owner: {
        getAccessToken: ({ provider }) => ({ accessToken: 'whatever access token' }),
      },
    };
    try {
      await (service as any).create({
        payload: campaignDraftMock as any,
        workspace: workspaceMock as any,
        user: {} as any,
      });
    } catch (err) {
      expect(err).toStrictEqual(
        new CreationException({
          stepFailure: StepFailure.AD,
          adAccount: adAccountMock as any,
          provider: SupportedProviders.FACEBOOK,
          error: 'Something went wrong' as any,
        }),
      );
    }
  });
});
