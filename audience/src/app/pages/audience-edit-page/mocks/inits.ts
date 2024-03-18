import { AudienceDto, TargetingAndDto } from '@instigo-app/data-transfer-object';

export const locationTestData = {
  countries: [
    {
      audienceSize: null,
      countryCode: 'CA',
      countryName: 'test',
      included: true,
      name: 'test',
      providerId: 'CA',
      providerSubType: 'country',
      providerType: 'adgeolocation',
      supportsCity: true,
      supportsRegion: true,
      type: 'countries',
    },
  ],
  locationTypes: [
    {
      providerId: 'home',
    },
    {
      providerId: 'recent',
    },
  ],
};

export const initFacebookTargetingRules: TargetingAndDto[] = [
  { or: { locationTypes: [] } },
  { or: { ageRange: [{ providerId: '(18,65)', type: 'ageRange' }] } },
  { or: { genders: [{ providerId: '0' }] } },
  { or: { locales: [{ providerId: [] }] } },
  { or: { targetOptimization: [{ providerId: false }] } },
  { or: { customAudiences: [{} as Array<Partial<AudienceDto>>] } },
  { or: { facebookConnections: [{ providerId: [] }] } },
];
