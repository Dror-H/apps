import { LinkedinCampaignSerializerManager } from '@api/campaign/services/linkedin/linkedin-campaign-serializer.manager';
import {
  AdTemplateType,
  BudgetType,
  CampaignStatusType,
  LinkedinCampaignDraft,
  LinkedinCostType,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';

const campaign = {
  settings: {
    provider: SupportedProviders.LINKEDIN,
    objective: 'WEBSITE_VISIT',
    name: 'test',
    account: {
      id: 'ce44b628-52e7-45b8-9b77-8c6020b80b1f',
      version: 4,
      name: "Insticore's Ad Account",
      provider: SupportedProviders.LINKEDIN,
      providerId: '506319907',
      status: 'ACTIVE',
      disableReason: 'NONE',
      totalAmountSpent: null,
      currency: 'EUR',
      businessId: '33273977',
      businessName: 'Insticore ',
      businessProfilePicture: 'whatever picture',
      providerMetadata: null,
      businessCity: 'Vienna',
      businessStreet: 'Hofzeile 18-20',
      businessStreet2: null,
      businessZip: '1190',
      businessCountryCode: 'AT',
      timezoneId: null,
      timezoneName: null,
      timezoneOffsetHoursUtc: null,
      minDailyBudget: null,
      pages: [],
      label: "Insticore's Ad Account",
    },
    campaignGroup: {
      providerId: '618074044',
      provider: 'linkedin',
      name: 'Test Group',
      version: 1,
      adAccount: {
        id: 'ce44b628-52e7-45b8-9b77-8c6020b80b1f',
        name: "Insticore's Ad Account",
      },
    },
    type: 'TEXT_AD',
    status: CampaignStatusType.PAUSED,
  },
  creatives: {
    multivariate: {
      adCombinations: [
        {
          headline: 'test 1',
          message: 'whatever text',
          linkDestination: 'https://instigo.io',
          callToAction: 'NO_BUTTON',
          adFormat: 'WEBCONVERSION_DESKTOP',
          adAccount: {
            id: '40f81c45-c18b-4796-99bf-0e14d95076c6',
            createdAt: '2021-11-08T13:59:37.253Z',
            updatedAt: '2021-11-08T14:05:21.714Z',
            version: 1,
            name: "Insticore's Ad Account",
            provider: SupportedProviders.LINKEDIN,
            providerId: '506319907',
            status: 'ACTIVE',
            disableReason: null,
            totalAmountSpent: null,
            currency: 'EUR',
            businessId: '33273977',
            businessName: 'Insticore ',
            businessProfilePicture:
              'https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1644451200&v=beta&t=DeYeRsb0TM2zLVycK3INVFNGNIeJtUXHKqFYbqgFxnk',
            providerMetadata: null,
            businessCity: null,
            businessStreet: null,
            businessStreet2: null,
            businessZip: null,
            businessCountryCode: null,
            timezoneId: null,
            timezoneName: null,
            timezoneOffsetHoursUtc: null,
            minDailyBudget: null,
            lastSynced: '2021-11-08T14:05:21.404Z',
            pages: [],
            label: "Insticore's Ad Account",
          },
          adTemplateType: AdTemplateType.IMAGE,
          picture: null,
          campaignObjective: 'WEBSITE_VISIT',
        },
        {
          headline: 'test 2',
          message: 'whatever text',
          linkDestination: 'https://instigo.io',
          callToAction: 'NO_BUTTON',
          adFormat: 'WEBCONVERSION_DESKTOP',
          adAccount: {
            id: '40f81c45-c18b-4796-99bf-0e14d95076c6',
            createdAt: '2021-11-08T13:59:37.253Z',
            updatedAt: '2021-11-08T14:05:21.714Z',
            version: 1,
            name: "Insticore's Ad Account",
            provider: SupportedProviders.LINKEDIN,
            providerId: '506319907',
            status: 'ACTIVE',
            disableReason: null,
            totalAmountSpent: null,
            currency: 'EUR',
            businessId: '33273977',
            businessName: 'Insticore ',
            businessProfilePicture:
              'https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1644451200&v=beta&t=DeYeRsb0TM2zLVycK3INVFNGNIeJtUXHKqFYbqgFxnk',
            providerMetadata: null,
            businessCity: null,
            businessStreet: null,
            businessStreet2: null,
            businessZip: null,
            businessCountryCode: null,
            timezoneId: null,
            timezoneName: null,
            timezoneOffsetHoursUtc: null,
            minDailyBudget: null,
            lastSynced: '2021-11-08T14:05:21.404Z',
            pages: [],
            label: "Insticore's Ad Account",
          },
          adTemplateType: AdTemplateType.IMAGE,
          picture: null,
          campaignObjective: 'WEBSITE_VISIT',
        },
      ],
      adTemplateType: AdTemplateType.IMAGE,
      image: {
        headline: ['test 1', 'test 2'],
        message: ['whatever text'],
        linkDestination: ['https://instigo.io'],
        callToAction: ['NO_BUTTON'],
        picture: null,
      },
    },
    adSetFormat: ['WEBCONVERSION_DESKTOP'],
  },
  targeting: {
    locale: 'en_US',
    targetingCriteria: {
      adAccount: {
        id: 'ce44b628-52e7-45b8-9b77-8c6020b80b1f',
        version: 4,
        name: "Insticore's Ad Account",
        provider: SupportedProviders.LINKEDIN,
        providerId: '506319907',
        status: 'ACTIVE',
        disableReason: 'NONE',
        totalAmountSpent: null,
        currency: 'EUR',
        businessId: '33273977',
        businessName: 'Insticore ',
        businessProfilePicture: 'whatever picture',
        providerMetadata: null,
        businessCity: 'Vienna',
        businessStreet: 'Hofzeile 18-20',
        businessStreet2: null,
        businessZip: '1190',
        businessCountryCode: 'AT',
        timezoneId: null,
        timezoneName: null,
        timezoneOffsetHoursUtc: null,
        minDailyBudget: null,
        pages: [],
        label: "Insticore's Ad Account",
      },
      provider: SupportedProviders.LINKEDIN,
      reach: {
        count: 1700000,
        active: 0,
      },
      target: {
        include: {
          and: [
            {
              or: {
                geolocations: [
                  {
                    name: 'Austria',
                    providerId: '103883259',
                    type: 'geolocations',
                    providerType: 'locations',
                    providerSubType: 'geo',
                    supportsRegion: false,
                    countryName: 'Austria',
                    supportsCity: false,
                    included: true,
                  },
                ],
                locationTypes: [
                  {
                    providerId: 'geolocations',
                  },
                ],
              },
            },
            {
              or: {},
            },
            {
              or: {
                customAudiences: [],
              },
            },
          ],
        },
        exclude: {
          or: {
            customAudiences: [],
          },
        },
      },
    },
  },
  budget: {
    range: {
      startDate: new Date('2021-10-20'),
      startTime: '19:08',
      endDate: new Date('2021-11-20'),
      endTime: '19:08',
    },
    costType: LinkedinCostType.CPC,
    budgetType: BudgetType.DAILY,
    budget: 20,
    spendCap: 1,
  },
};

const expectedCampaign = {
  adAccount: {
    businessCity: 'Vienna',
    businessCountryCode: 'AT',
    businessId: '33273977',
    businessName: 'Insticore ',
    businessProfilePicture: 'whatever picture',
    businessStreet: 'Hofzeile 18-20',
    businessStreet2: null,
    businessZip: '1190',
    currency: 'EUR',
    disableReason: 'NONE',
    id: 'ce44b628-52e7-45b8-9b77-8c6020b80b1f',
    label: "Insticore's Ad Account",
    minDailyBudget: null,
    name: "Insticore's Ad Account",
    pages: [],
    provider: 'linkedin',
    providerId: '506319907',
    providerMetadata: null,
    status: 'ACTIVE',
    timezoneId: null,
    timezoneName: null,
    timezoneOffsetHoursUtc: null,
    totalAmountSpent: null,
    version: 4,
  },
  name: 'test',
  provider: 'linkedin',
  providerSpecificFields: {
    campaignGroup: 'urn:li:sponsoredCampaignGroup:618074044',
    costType: 'CPC',
    dailyBudget: {
      amount: '20',
    },
    locale: {
      country: 'US',
      language: 'en',
    },
    objectiveType: 'WEBSITE_VISIT',
    runSchedule: {
      end: new Date('2021-11-20T19:08:00').getTime(),
      start: new Date('2021-10-20T19:08:00').getTime(),
    },
    targetingCriteria: {
      exclude: {
        or: {
          customAudiences: [],
        },
      },
      include: {
        and: [
          {
            or: {
              geolocations: [
                {
                  countryName: 'Austria',
                  included: true,
                  name: 'Austria',
                  providerId: '103883259',
                  providerSubType: 'geo',
                  providerType: 'locations',
                  supportsCity: false,
                  supportsRegion: false,
                  type: 'geolocations',
                },
              ],
              locationTypes: [
                {
                  providerId: 'geolocations',
                },
              ],
            },
          },
          {
            or: {},
          },
          {
            or: {
              customAudiences: [],
            },
          },
        ],
      },
    },
    type: 'TEXT_AD',
    unitCost: {
      amount: '1',
    },
  },
  status: 'PAUSED',
} as Partial<LinkedinCampaignDraft>;

const expectedAd = [
  {
    provider: 'linkedin',
    providerSpecificFields: {
      adTemplate: {
        adAccount: {
          businessCity: null,
          businessCountryCode: null,
          businessId: '33273977',
          businessName: 'Insticore ',
          businessProfilePicture:
            'https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1644451200&v=beta&t=DeYeRsb0TM2zLVycK3INVFNGNIeJtUXHKqFYbqgFxnk',
          businessStreet: null,
          businessStreet2: null,
          businessZip: null,
          createdAt: '2021-11-08T13:59:37.253Z',
          currency: 'EUR',
          disableReason: null,
          id: '40f81c45-c18b-4796-99bf-0e14d95076c6',
          label: "Insticore's Ad Account",
          lastSynced: '2021-11-08T14:05:21.404Z',
          minDailyBudget: null,
          name: "Insticore's Ad Account",
          pages: [],
          provider: SupportedProviders.LINKEDIN,
          providerId: '506319907',
          providerMetadata: null,
          status: 'ACTIVE',
          timezoneId: null,
          timezoneName: null,
          timezoneOffsetHoursUtc: null,
          totalAmountSpent: null,
          updatedAt: '2021-11-08T14:05:21.714Z',
          version: 1,
        },
        adFormat: 'WEBCONVERSION_DESKTOP',
        adTemplateType: 'IMAGE',
        callToAction: 'NO_BUTTON',
        campaignObjective: 'WEBSITE_VISIT',
        headline: 'test 1',
        linkDestination: 'https://instigo.io',
        message: 'whatever text',
        picture: null,
      },
      campaignId: 'campaign Id',
      type: 'TEXT_AD',
    },
  },
  {
    provider: 'linkedin',
    providerSpecificFields: {
      adTemplate: {
        adAccount: {
          businessCity: null,
          businessCountryCode: null,
          businessId: '33273977',
          businessName: 'Insticore ',
          businessProfilePicture:
            'https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1644451200&v=beta&t=DeYeRsb0TM2zLVycK3INVFNGNIeJtUXHKqFYbqgFxnk',
          businessStreet: null,
          businessStreet2: null,
          businessZip: null,
          createdAt: '2021-11-08T13:59:37.253Z',
          currency: 'EUR',
          disableReason: null,
          id: '40f81c45-c18b-4796-99bf-0e14d95076c6',
          label: "Insticore's Ad Account",
          lastSynced: '2021-11-08T14:05:21.404Z',
          minDailyBudget: null,
          name: "Insticore's Ad Account",
          pages: [],
          provider: SupportedProviders.LINKEDIN,
          providerId: '506319907',
          providerMetadata: null,
          status: 'ACTIVE',
          timezoneId: null,
          timezoneName: null,
          timezoneOffsetHoursUtc: null,
          totalAmountSpent: null,
          updatedAt: '2021-11-08T14:05:21.714Z',
          version: 1,
        },
        adFormat: 'WEBCONVERSION_DESKTOP',
        adTemplateType: 'IMAGE',
        callToAction: 'NO_BUTTON',
        campaignObjective: 'WEBSITE_VISIT',
        headline: 'test 2',
        linkDestination: 'https://instigo.io',
        message: 'whatever text',
        picture: null,
      },
      campaignId: 'campaign Id',
      type: 'TEXT_AD',
    },
  },
];

describe('LinkedinCampaignSerializerManager', () => {
  it('should serialize a campaign', () => {
    const campaignSerializerManager = new LinkedinCampaignSerializerManager(campaign);
    const serializedCampaign = campaignSerializerManager.createCampaignObject();

    expect(serializedCampaign).toEqual(expectedCampaign);
  });

  it('should serialize the ad', () => {
    const campaignSerializerManager = new LinkedinCampaignSerializerManager(campaign);
    const ads = campaignSerializerManager.createAdObject('campaign Id');
    expect(ads).toEqual(expectedAd);
  });
});
