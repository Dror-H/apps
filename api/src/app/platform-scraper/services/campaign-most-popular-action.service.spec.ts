import { AdSetRepository } from '@api/ad-set/data/ad-set.repository';
import { CampaignRepository } from '@api/campaign/data/campaign.repository';
import { QueueNames } from '@instigo-app/data-transfer-object';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { BullModule } from '@nestjs/bull';
import { Test } from '@nestjs/testing';
import { Job, Queue } from 'bull';
import { CampaignMostPopularActionScrapperService } from './campaign-most-popular-action.service';

jest.mock('@nest-toolbox/typeorm-upsert');

describe('CampaignMostPopularActionScrapperService Test suite', () => {
  let campaignMostPopularActionScrapperService: CampaignMostPopularActionScrapperService;
  let campaignRepository: CampaignRepository;
  let adSetRepository: AdSetRepository;
  let adSetsQueue;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: QueueNames.ADSETS })],
      providers: [
        CampaignMostPopularActionScrapperService,
        { provide: CampaignRepository, useValue: {} },
        { provide: AdSetRepository, useValue: {} },
        { provide: QueueNames.ADSETS, useValue: {} },
      ],
    }).compile();

    campaignMostPopularActionScrapperService = module.get<CampaignMostPopularActionScrapperService>(
      CampaignMostPopularActionScrapperService,
    );
    campaignRepository = module.get<CampaignRepository>(CampaignRepository);
    adSetRepository = module.get<AdSetRepository>(AdSetRepository);
    adSetsQueue = module.get<Queue>(QueueNames.ADSETS);
  });

  it('should be defined', () => {
    expect(campaignMostPopularActionScrapperService).toBeDefined();
  });

  it('should adMostPopularActionOnCampaigns ', async () => {
    // Arrange
    const job = {
      data: { adAccount: { id: '123' } },
    };
    const campaigns = [{ objective: 'CONVERSIONS' }];
    const promObjValue = 'RANDOM';
    const adSets = [
      {
        optimizationGoal: 'OFFSITE_CONVERSIONS',
        promotedObject: { pixel_id: 12321321, custom_event_type: promObjValue },
      },
      {
        optimizationGoal: 'OFFSITE_CONVERSIONS',
        promotedObject: { pixel_id: 12321321, custom_event_type: promObjValue },
      },
      {
        optimizationGoal: 'LINK_CLICKS',
        promotedObject: { pixel_id: 12321321 },
      },
    ];
    const result = 'offsite_conversion.fb_pixel_random';

    campaignRepository.find = jest.fn().mockResolvedValue(campaigns);
    adSetRepository.find = jest.fn().mockResolvedValue(adSets);
    (TypeOrmUpsert as any).mockImplementation(() => ({ length: 3 }));
    // Act

    await campaignMostPopularActionScrapperService.adMostPopularActionOnCampaigns(job as Job);
    // Assert

    expect(TypeOrmUpsert).toHaveBeenCalledWith(
      expect.anything(),
      [{ objective: 'CONVERSIONS', actionTypeField: result }],
      expect.anything(),
      expect.anything(),
    );
  });
});
