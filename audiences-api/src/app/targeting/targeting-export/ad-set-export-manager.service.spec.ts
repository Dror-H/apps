import { Test } from '@nestjs/testing';
import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { ThirdPartyAdSetApiService, ThirdPartyFacebookExportApiService } from '@instigo-app/third-party-connector';
import { AdSetExportManagerService } from '@audiences-api/targeting/targeting-export/ad-set-export-manager.service';
import {
  AdAccountDTO,
  AdSetDTO,
  CampaignDTO,
  CampaignStatusType,
  TargetingDto,
} from '@instigo-app/data-transfer-object';
import { FacebookTargetingExportSerializer } from '@audiences-api/targeting/targeting-export/facebook-targeting-export-serializer';
import { of, throwError } from 'rxjs';
import { ForbiddenException } from '@nestjs/common';

describe('AdsetExportManager.service', () => {
  let adsetManager: AdSetExportManagerService;
  let thirdPartyService: ThirdPartyFacebookExportApiService;
  let bulkService: ThirdPartyAdSetApiService;
  let prismaService: PrismaService;
  let intiCall: () => Promise<AdSetDTO>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AdSetExportManagerService,
        {
          provide: PrismaService,
          useValue: {
            adAccount: {
              findFirst: () => {},
              update: (adset) => adset,
            },
          },
        },
        {
          provide: ThirdPartyFacebookExportApiService,
          useValue: {
            getFacebookAdSetById: () => {},
            getAdSetById: () => {},
            createAdSet: (adset) => adset,
          },
        },
        {
          provide: ThirdPartyAdSetApiService,
          useValue: {
            bulkPatch: () => {},
          },
        },
      ],
    }).compile();

    adsetManager = moduleRef.get<AdSetExportManagerService>(AdSetExportManagerService);
    thirdPartyService = moduleRef.get<ThirdPartyFacebookExportApiService>(ThirdPartyFacebookExportApiService);
    bulkService = moduleRef.get<ThirdPartyAdSetApiService>(ThirdPartyAdSetApiService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    intiCall = () =>
      adsetManager.updateAdSetTargeting(
        new FacebookTargetingExportSerializer('adset', { id: 'adsetId' } as AdAccountDTO, {} as TargetingDto),
        'fadsfads0',
        { name: 'campaign', id: 'fasdfadsf' } as CampaignDTO,
      );
  });

  it('should be defined', () => {
    expect(adsetManager).toBeDefined();
  });

  describe('success', () => {
    it('should update an adset', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ adsetId: '413265921' }));

      jest
        .spyOn(thirdPartyService, 'getAdSetById')
        .mockReturnValue(Promise.resolve({ name: 'adset', status: CampaignStatusType.PAUSED } as AdSetDTO));
      const updateSpy = jest.spyOn(bulkService, 'bulkPatch').mockReturnValue(of([{ providerId: 'someAdsetId' }]));

      await intiCall();

      expect(updateSpy).toHaveBeenCalledWith({
        accessToken: 'fadsfads0',
        adSets: [
          {
            name: 'adset',
            status: 'PAUSED',
            targeting: {},
          },
        ],
        provider: 'facebook',
      });
    });

    it('create adset if adsetId is not stored in db', async () => {
      jest.spyOn(prismaService.adAccount as any, 'findFirst').mockReturnValue(Promise.resolve({ adsetId: null }));

      jest
        .spyOn(thirdPartyService, 'createAdSet')
        .mockReturnValue(Promise.resolve({ providerId: 'createdAdSetId' } as AdSetDTO));
      const dbSpy = jest.spyOn(prismaService.adAccount, 'update');

      await intiCall();

      expect(dbSpy).toHaveBeenCalledWith({
        where: {
          id: 'adsetId',
        },
        data: {
          adsetId: 'createdAdSetId',
        },
      });
    });

    it('update adset if adset is deleted or archived', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ adsetId: '34151234123' }));
      jest
        .spyOn(thirdPartyService, 'getAdSetById')
        .mockReturnValue(Promise.resolve({ status: CampaignStatusType.ARCHIVED } as AdSetDTO));

      jest
        .spyOn(thirdPartyService, 'createAdSet')
        .mockReturnValue(Promise.resolve({ providerId: 'newAdSet' } as AdSetDTO));

      const dbSpy = jest.spyOn(prismaService.adAccount, 'update');

      await intiCall();
      expect(dbSpy).toHaveBeenCalledWith({
        where: {
          id: 'adsetId',
        },
        data: {
          adsetId: 'newAdSet',
        },
      });
    });
  });

  describe('error', () => {
    it('create adset if adsetId is not stored in db', async () => {
      jest.spyOn(prismaService.adAccount as any, 'findFirst').mockReturnValue(Promise.resolve({ adsetId: null }));
      jest.spyOn(thirdPartyService, 'createAdSet').mockReturnValue(Promise.reject('some error'));

      try {
        await intiCall();
      } catch (err) {
        expect(err).toEqual(new ForbiddenException('some error'));
      }
    });

    it('facebook get by id fail', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ adsetId: 'someAdsetId' }));
      jest.spyOn(thirdPartyService, 'getAdSetById').mockReturnValue(Promise.reject('some error'));
      try {
        await intiCall();
      } catch (err) {
        expect(err).toEqual(new ForbiddenException('some error'));
      }
    });

    it('should update an adset error', async () => {
      jest
        .spyOn(prismaService.adAccount as any, 'findFirst')
        .mockReturnValue(Promise.resolve({ adsetId: '413265921' }));

      jest
        .spyOn(thirdPartyService, 'getAdSetById')
        .mockReturnValue(Promise.resolve({ name: 'adset', status: CampaignStatusType.PAUSED } as AdSetDTO));
      jest.spyOn(bulkService, 'bulkPatch').mockReturnValue(throwError('some adset update error'));
      try {
        await intiCall();
      } catch (err) {
        expect(err).toEqual(new ForbiddenException('some adset update error'));
      }
    });
  });
});
