import { Test } from '@nestjs/testing';
import { CampaignExportManagerService } from '@audiences-api/targeting/targeting-export/campaign-export-manager.service';
import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { ThirdPartyFacebookExportApiService } from '@instigo-app/third-party-connector';
import { AdAccountDTO, CampaignDTO, CampaignStatusType, TargetingDto } from '@instigo-app/data-transfer-object';
import { FacebookTargetingExportSerializer } from '@audiences-api/targeting/targeting-export/facebook-targeting-export-serializer';
import { ForbiddenException } from '@nestjs/common';

describe('CampaignExportManagerService', () => {
  let campaignManager: CampaignExportManagerService;
  let thirdPartyService: ThirdPartyFacebookExportApiService;
  let prismaService: PrismaService;
  let initCall: () => Promise<CampaignDTO>;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CampaignExportManagerService,
        {
          provide: PrismaService,
          useValue: {
            adAccount: {
              findFirst: () => {},
              update: (campaign) => campaign,
            },
          },
        },
        {
          provide: ThirdPartyFacebookExportApiService,
          useValue: {
            getFacebookCampaignById: () => {},
            getCampaignById: () => {},
            createCampaign: (campaign) => campaign,
          },
        },
      ],
    }).compile();

    campaignManager = moduleRef.get<CampaignExportManagerService>(CampaignExportManagerService);
    thirdPartyService = moduleRef.get<ThirdPartyFacebookExportApiService>(ThirdPartyFacebookExportApiService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    initCall = () =>
      campaignManager.getCampaign(
        new FacebookTargetingExportSerializer('name', { id: 'fasdfa' } as AdAccountDTO, {} as TargetingDto),
        'fadskfhlkjadhsfa',
      );
  });

  it('should be defined', () => {
    expect(campaignManager).toBeDefined();
  });

  describe('success case', () => {
    it('should get the campaign when it is saved in db and status is ok', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ campaignId: '413265921' }));
      jest
        .spyOn(thirdPartyService, 'getCampaignById')
        .mockReturnValue(Promise.resolve({ name: 'campaign', status: CampaignStatusType.PAUSED } as CampaignDTO));
      expect(await initCall()).toEqual({ name: 'campaign', status: CampaignStatusType.PAUSED });
    });

    it('should get the campaign but the status is DELETED', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ campaignId: '413265921' }));
      jest
        .spyOn(thirdPartyService, 'getCampaignById')
        .mockReturnValue(Promise.resolve({ name: 'campaign', status: CampaignStatusType.DELETED } as CampaignDTO));

      const facebookCreateCampaignSpy = jest.spyOn(thirdPartyService, 'createCampaign');
      const prismaUpdateSpy = jest.spyOn(prismaService.adAccount as any, 'update');
      await initCall();
      expect(facebookCreateCampaignSpy).toHaveBeenCalled();
      expect(prismaUpdateSpy).toHaveBeenCalled();
    });

    it('should get the campaign but the status is ACTIVE', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ campaignId: '413265921' }));
      jest
        .spyOn(thirdPartyService, 'getCampaignById')
        .mockReturnValue(Promise.resolve({ name: 'campaign', status: CampaignStatusType.ACTIVE } as CampaignDTO));

      const facebookCreateCampaignSpy = jest.spyOn(thirdPartyService, 'createCampaign');
      const prismaUpdateSpy = jest.spyOn(prismaService.adAccount as any, 'update');
      await initCall();
      expect(facebookCreateCampaignSpy).toHaveBeenCalled();
      expect(prismaUpdateSpy).toHaveBeenCalled();
    });

    it('should get the campaign but the status is ARCHIVED', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ campaignId: '413265921' }));
      jest
        .spyOn(thirdPartyService, 'getCampaignById')
        .mockReturnValue(Promise.resolve({ name: 'campaign', status: CampaignStatusType.ARCHIVED } as CampaignDTO));

      const facebookCreateCampaignSpy = jest.spyOn(thirdPartyService, 'createCampaign');
      const prismaUpdateSpy = jest.spyOn(prismaService.adAccount as any, 'update');
      await initCall();
      expect(facebookCreateCampaignSpy).toHaveBeenCalled();
      expect(prismaUpdateSpy).toHaveBeenCalled();
    });
  });

  describe('error case', () => {
    it('should not get the campaign for db', async () => {
      jest.spyOn(prismaService.adAccount as any, 'findFirst').mockReturnValue(Promise.resolve({ campaignId: null }));

      const facebookCreateCampaignSpy = jest.spyOn(thirdPartyService, 'createCampaign');
      const prismaUpdateSpy = jest.spyOn(prismaService.adAccount as any, 'update');
      await initCall();
      expect(facebookCreateCampaignSpy).toHaveBeenCalled();
      expect(prismaUpdateSpy).toHaveBeenCalled();
    });

    it('should throw a ForbiddenError on db failure', async () => {
      jest.spyOn(prismaService.adAccount as any, 'findFirst').mockReturnValue(Promise.reject('db err'));

      try {
        await initCall();
      } catch (err) {
        expect(err).toEqual(new ForbiddenException('db err'));
      }
    });

    it('should throw a ForbiddenError on facebook campaign getById', async () => {
      jest.spyOn(prismaService.adAccount as any, 'findFirst').mockReturnValue(Promise.resolve({ campaignId: null }));
      jest.spyOn(thirdPartyService, 'getCampaignById').mockReturnValue(Promise.reject('campaign fetch err'));
      try {
        await initCall();
      } catch (err) {
        expect(err).toEqual(new ForbiddenException('campaign fetch err'));
      }
    });

    it('should throw a ForbiddenError on facebook campaign creation', async () => {
      jest.spyOn(prismaService.adAccount as any, 'findFirst').mockReturnValue(Promise.resolve({ campaignId: null }));
      jest
        .spyOn(thirdPartyService, 'getCampaignById')
        .mockReturnValue(Promise.resolve({ name: 'campaign', status: CampaignStatusType.PAUSED } as CampaignDTO));
      jest.spyOn(thirdPartyService, 'createCampaign').mockReturnValue(Promise.reject('camp creation err'));
      try {
        await initCall();
      } catch (err) {
        expect(err).toEqual(new ForbiddenException('camp creation err'));
      }
    });
  });
});
