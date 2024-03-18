import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { Ad } from '@api/ad/data/ad.entity';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays } from 'date-fns';
import * as faker from 'faker';
import { Connection, Repository } from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class MockInsightsService implements OnModuleInit {
  @InjectRepository(AdAccount)
  private readonly adAccountRepository: Repository<AdAccount>;

  @Inject(Connection)
  private readonly connection: Connection;

  async onModuleInit() {
    // await this.mockAccount();
  }

  async mockAccount() {
    const accounts = await this.adAccountRepository.find({ where: { provider: SupportedProviders.FACEBOOK } });
    const { results, errors } = await new PromisePool().for(accounts).process(async (account) => {
      const ads = await this.connection
        .createQueryBuilder(Ad, 'ad')
        .select(['ad.id', 'ad.providerId'])
        .leftJoin('ad.adSet', 'adsets')
        .addSelect(['adsets.id', 'adsets.providerId'])
        .leftJoin('ad.campaign', 'campaign')
        .addSelect(['campaign.id', 'campaign.providerId'])
        .where({ adAccount: account.id })
        .getMany();
      return await new PromisePool()
        .for(ads)
        .withConcurrency(50)
        .process((ad) => {
          const insights = [];
          let date = new Date('2021');
          while (date < new Date()) {
            date = addDays(date, 1);
            insights.push(
              this.insightsRow({
                ad: ad.providerId,
                adset: ad.adSet.providerId,
                campaign: ad.campaign.providerId,
                adAccount: account.providerId.split('_')[1],
                date: date,
              }),
            );
          }
          console.log(`progress => ${ads.indexOf(ad)} of ${ads.length}`);
          // return await to((this.facebookParseJobsService as any).saveInsights({ insights }));
          return [];
        });
    });
    console.log(results, errors);
  }

  genId({ ad, adset, campaign, adAccount, date }) {
    const byteString = `
    ${adAccount},
    ${campaign},
    ${adset},
    ${ad},
    ${date},
    ${'NULL'},
    ${'NULL'},
    ${'NULL'},
    ${'NULL'},
    ${'NULL'},
    ${'NULL'},
    ${'NULL'},
    ${'NULL'},
    ${'NULL'}`
      .replace(/\s/gi, '')
      .toString();

    return uuidv5(byteString, uuidv5.URL);
  }

  insightsRow({ ad, adset, campaign, adAccount, date }) {
    return {
      id: this.genId({ ad, adset, campaign, adAccount, date }),
      adAccountId: adAccount,
      campaignId: campaign,
      adSetId: adset,
      adId: ad,
      date: date,
      breakdown: 'NONE',
      country: 'NULL',
      region: 'NULL',
      age: 'NULL',
      gender: 'NULL' as any,
      publisherPlatform: 'NULL',
      platformPosition: 'NULL',
      hourlyRange: 'NULL',
      devicePlatform: 'NULL',
      metric: {
        actions: [
          {
            action_type: 'offsite_conversion.fb_pixel_view_content',
            value: '2',
          },
        ],
        actionValues: [],
        attributionSetting: null,
        buyingType: 'AUCTION',
        canvasAvgViewPercent: faker.datatype.number(),
        canvasAvgViewTime: faker.datatype.number(),
        catalogSegmentValue: faker.datatype.number(),
        clicks: faker.datatype.number(),
        conversionRateRanking: null,
        conversions: [],
        conversionValues: faker.datatype.number(),
        convertedProductQuantity: faker.datatype.number(),
        convertedProductValue: faker.datatype.number(),
        costPerActionType: [],
        costPerConversion: [],
        costPerThruplay: faker.datatype.number(),
        costPerUniqueActionType: [],
        costPerUniqueClick: faker.datatype.number(),
        costPerUniqueInlineLinkClick: faker.datatype.number(),
        costPerUniqueOutboundClick: faker.datatype.number(),
        engagementRateRanking: null,
        estimatedAdRecallers: faker.datatype.number(),
        estimatedAdRecallRate: faker.datatype.number(),
        frequency: faker.datatype.number(),
        fullViewImpressions: faker.datatype.number(),
        fullViewReach: faker.datatype.number(),
        impressions: faker.datatype.number(),
        inlineLinkClicks: faker.datatype.number(),
        inlinePostEngagement: faker.datatype.number(),
        instantExperienceClicksToOpen: faker.datatype.number(),
        instantExperienceClicksToStart: faker.datatype.number(),
        instantExperienceOutboundClicks: faker.datatype.number(),
        mobileAppPurchaseRoas: [],
        objective: faker.random.arrayElement(['CONVERSIONS', 'LEAD_GENERATION']),
        optimizationGoal: faker.random.arrayElement(['OFFSITE_CONVERSIONS', 'LINK_CLICKS']),
        outboundClicks: faker.datatype.number(),
        placePageName: null,
        purchaseRoas: [],
        qualifyingQuestionQualifyAnswerRate: faker.datatype.number(),
        reach: faker.datatype.number(),
        socialSpend: faker.datatype.number(),
        spend: faker.datatype.number(),
        uniqueClicks: faker.datatype.number(),
        video30SecWatchedActions: faker.datatype.number(),
        videoAvgTimeWatchedActions: faker.datatype.number(),
        videoP100WatchedActions: faker.datatype.number(),
        videoP25WatchedActions: faker.datatype.number(),
        videoP50WatchedActions: faker.datatype.number(),
        videoP75WatchedActions: faker.datatype.number(),
        videoP95WatchedActions: faker.datatype.number(),
        videoPlayActions: faker.datatype.number(),
        videoPlayCurveActions: [],
        websiteCtr: faker.datatype.number(),
        websitePurchaseRoas: [],
      },
    };
  }
}
