import { SearchResult, SupportedProviders } from '@instigo-app/data-transfer-object';

export const addFoundAudiencesSearchResults1: SearchResult[] = [
  {
    id: '14b4016c-41dc-47cb-85e3-c61ee3650fdc',
    spec: {
      provider: SupportedProviders.FACEBOOK,
      include: {
        and: [
          { or: { ageRange: [{ providerId: '(30,60)', type: 'ageRange' }] } },
          { or: { locales: [{ providerId: [] }] } },
          { or: {} },
        ],
      },
      exclude: { or: {} },
    },
    topics: [],
    rank: 100,
    specRatio: { interests: 100, demographics: 0, behaviors: 0 },
    userTags: [],
  },
  {
    id: '24b4016c-41dc-47cb-85e3-c61ee3650fdg',
    spec: {
      provider: SupportedProviders.FACEBOOK,
      include: {
        and: [
          { or: { ageRange: [{ providerId: '(30,60)', type: 'ageRange' }] } },
          { or: { locales: [{ providerId: [] }] } },
          { or: {} },
        ],
      },
      exclude: { or: {} },
    },
    topics: [],
    rank: 50,
    specRatio: { interests: 100, demographics: 0, behaviors: 0 },
    userTags: [],
  },
];
export const addFoundAudiencesSearchResults2: SearchResult[] = [
  {
    id: '34b4016c-41dc-47cb-85e3-c61ee3651234',
    spec: {
      provider: SupportedProviders.FACEBOOK,
      include: {
        and: [
          { or: { ageRange: [{ providerId: '(30,60)', type: 'ageRange' }] } },
          { or: { locales: [{ providerId: [] }] } },
          { or: {} },
        ],
      },
      exclude: { or: {} },
    },
    topics: [],
    rank: 75,
    specRatio: { interests: 100, demographics: 0, behaviors: 0 },
    userTags: [],
  },
];

export const addFoundAudiencesSortedResult: SearchResult[] = [
  addFoundAudiencesSearchResults1[0],
  addFoundAudiencesSearchResults2[0],
  addFoundAudiencesSearchResults1[1],
];
