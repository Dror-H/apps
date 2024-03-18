import { TargetingExportService } from './targeting-export.service';
import { Test } from '@nestjs/testing';
import { CampaignExportManagerService } from '@audiences-api/targeting/targeting-export/campaign-export-manager.service';
import { AdSetExportManagerService } from '@audiences-api/targeting/targeting-export/ad-set-export-manager.service';
import { AdAccountDTO, AdSetDTO, CampaignDTO, TargetingDto } from '@instigo-app/data-transfer-object';
import { ForbiddenException } from '@nestjs/common';

describe('TargetingExportService', () => {
  let targetingExportService: TargetingExportService;
  let campaignManager: CampaignExportManagerService;
  let adsetManager: AdSetExportManagerService;
  let initCall: () => Promise<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }>;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TargetingExportService,
        {
          provide: AdSetExportManagerService,
          useValue: {
            updateAdSetTargeting: (manager, accessToken, campaign) => ({ adset: 'someAdset', campaign }),
          },
        },
        {
          provide: CampaignExportManagerService,
          useValue: {
            getCampaign: (manager, accessToken) => ({ campaignId: 'fasdfas' }),
          },
        },
      ],
    }).compile();

    campaignManager = moduleRef.get<CampaignExportManagerService>(CampaignExportManagerService);
    adsetManager = moduleRef.get<AdSetExportManagerService>(AdSetExportManagerService);
    targetingExportService = moduleRef.get<TargetingExportService>(TargetingExportService);
    initCall = async () =>
      await targetingExportService.facebookExport(
        {} as TargetingDto,
        { id: 'adaccount' } as AdAccountDTO,
        'fadsggasdfas',
        'some targeting',
      );
  });

  it('should be defined', () => {
    expect(targetingExportService).toBeDefined();
  });

  it('should return a valid campaign and adset', async () => {
    const response = await initCall();
    expect(response).toEqual({
      adSet: {
        adset: 'someAdset',
        campaign: {
          campaignId: 'fasdfas',
        },
      },
      campaign: {
        campaignId: 'fasdfas',
      },
    });
  });
  it('should throw error on getCampaign', async () => {
    jest.spyOn(campaignManager, 'getCampaign').mockReturnValue(Promise.reject(new ForbiddenException('some error')));
    try {
      await initCall();
    } catch (err) {
      expect(err).toEqual(new ForbiddenException('some error'));
    }
  });
  it('should throw error on updateAdsetTargeting', async () => {
    jest
      .spyOn(adsetManager, 'updateAdSetTargeting')
      .mockReturnValue(Promise.reject(new ForbiddenException('some error')));
    try {
      await initCall();
    } catch (err) {
      expect(err).toEqual(new ForbiddenException('some error'));
    }
  });
});
