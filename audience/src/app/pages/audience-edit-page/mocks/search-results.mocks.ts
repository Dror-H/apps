/* eslint-disable max-lines */
import { SearchResult, SupportedProviders } from '@instigo-app/data-transfer-object';

export const noPathSearchResult: SearchResult = {
  id: 'b4b4016c-41dc-47cb-85e3-c61ee3650fdc',
  spec: {
    provider: SupportedProviders.FACEBOOK,
    include: {
      and: [
        { or: { ageRange: [{ providerId: '(30,60)', type: 'ageRange' }] } },
        { or: { locales: [{ providerId: [] }] } },
        {
          or: {
            interests: [
              {
                providerId: '123456789',
                type: 'interests',
                name: 'TEST with name',
              },

              {
                providerId: '789456123',
                type: 'interests',
                audienceSize: 855532.5,
              },
            ],
            demographics: [
              {
                providerId: '9876354321',
                name: 'TEST with name and size',
                type: 'interests',
                audienceSize: 855532.5,
              },
            ],
            workPositions: [
              {
                providerId: '105563979478424',
                type: 'workPositions',
              },
            ],
          },
        },
      ],
    },
    exclude: { or: {} },
  },
  topics: ['developers', 'dev', 'xda', 'worldwide', 'salesforce'],
  rank: 51,
  specRatio: { interests: 100, demographics: 0, behaviors: 0 },
};

export const pathMergeSearchResult: SearchResult = {
  id: 'b4b4016c-41dc-47cb-85e3-c61ee3650fdc',
  spec: {
    provider: SupportedProviders.FACEBOOK,
    include: {
      and: [
        { or: { ageRange: [{ providerId: '(30,60)', type: 'ageRange' }] } },
        { or: { locales: [{ providerId: [] }] } },
        {
          or: {
            behaviors: [
              {
                providerId: '6002714898572',
                type: 'behaviors',
                path: ['path-1', 'path-1.2'],
                name: 'path-1 path-1.2',
                audienceSize: 48970322,
              },
              {
                providerId: '6002714898123',
                type: 'behaviors',
                path: ['path-1'],
                name: 'path-1',
                audienceSize: 48970322,
              },
            ],
            interests: [
              {
                providerId: '6002884511422',
                type: 'interests',
                path: ['path-1', 'path-1.2'],
                name: 'path-1 path-1.2',
                audienceSize: 192686100.5,
              },
              {
                providerId: '6002884511422',
                type: 'interests',
                path: ['path-1'],
                name: 'path-1',
                audienceSize: 192686100.5,
              },
            ],
            employers: [
              {
                providerId: '109288035760640',
                type: 'employers',
                path: ['path-2', 'path-2.2'],
                name: 'path-2 path-2.2 double',
                audienceSize: 116699,
              },
              {
                providerId: '112168642212790',
                type: 'employers',
                path: ['path-2', 'path-2.2', 'path-2.3'],
                name: 'path-2 path-2.2 path-2.3 double',
                audienceSize: 116699,
              },
            ],
          },
        },
      ],
    },
    exclude: { or: {} },
  },
  topics: ['developers', 'dev', 'xda', 'worldwide', 'salesforce'],
  rank: 51,
  specRatio: { interests: 100, demographics: 0, behaviors: 0 },
};

// work positions and employers not working
export const multipleOrSearchResult: SearchResult = {
  id: 'b4b4016c-41dc-47cb-85e3-c61ee3650fdc',
  spec: {
    provider: SupportedProviders.FACEBOOK,
    include: {
      and: [
        { or: { ageRange: [{ providerId: '(30,60)', type: 'ageRange' }] } },
        { or: { locales: [{ providerId: [] }] } },
        {
          or: {
            behaviors: [
              {
                providerId: '6002714898572',
                type: 'behaviors',
                path: ['behaviors', 'behaviors double'],
                name: 'behavior or 1',
                audienceSize: 48970322,
              },
            ],
          },
        },
        {
          or: {
            interests: [
              {
                providerId: '6002884511422',
                type: 'interests',
                path: ['interests', 'interests double'],
                name: 'interests or',
                audienceSize: 192686100.5,
              },
            ],
          },
        },
        {
          or: {
            demographics: [
              {
                providerId: '6002884511422',
                type: 'demographics',
                path: ['demographics', 'demographics double'],
                name: 'demographics or',
                audienceSize: 192686100.5,
              },
            ],
          },
        },
        {
          or: {
            employers: [
              {
                providerId: '104076956295773',
                type: 'employers',
                path: ['employers', 'employers double'],
                name: 'Computer science',
                audienceSize: 61702,
              },
            ],
          },
        },
        {
          or: {
            workPositions: [
              {
                providerId: '1411199365848063',
                type: 'workPositions',
                path: ['Demographics', 'Demographics double', 'Work', 'Job titles', 'Chief Technology Officer (CTO)'],
                name: 'Chief Technology Officer (CTO)',
                audienceSize: 61702,
              },
            ],
          },
        },
        {
          or: {
            fieldsOfStudy: [
              {
                providerId: '106168626080858',
                type: 'fieldsOfStudy',
                path: ['education_majors', 'education_majors double'],
                name: 'Software engineering',
                audienceSize: 61702,
              },
            ],
          },
        },
        {
          or: {
            schools: [
              {
                providerId: '104076956295773',
                type: 'schools',
                path: ['education_schools', 'education_schools double'],
                name: 'Computer science',
                audienceSize: 61702,
              },
            ],
          },
        },
      ],
    },
    exclude: { or: {} },
  },
  topics: ['developers', 'dev', 'xda', 'worldwide', 'salesforce'],
  rank: 51,
  specRatio: { interests: 100, demographics: 0, behaviors: 0 },
};

export const selectTagsSearchResult: SearchResult = {
  id: '06c1b802-5785-569f-8121-3ba107c12623',
  spec: {
    provider: SupportedProviders.FACEBOOK,
    include: {
      and: [
        { or: { ageRange: [{ providerId: '(25,50)', type: 'ageRange' }] } },
        { or: { locales: [{ providerId: [] }] } },
        { or: {} },
      ],
    },
    exclude: {
      or: {},
    },
  },
  rank: 61,
  specRatio: { interests: 90, demographics: 10, behaviors: 0 },
  topics: ['business', 'director', 'owners', 'marketing', 'managing', '2'.repeat(200)],
  userTags: ['dev', 'dev', 'dev', 'guru', '1'.repeat(200)],
};

export const regularSearchResult: SearchResult = {
  id: '06c1b802-5785-569f-8121-3ba107c12625',
  spec: {
    provider: SupportedProviders.FACEBOOK,
    include: {
      and: [
        { or: { ageRange: [{ providerId: '(25,50)', type: 'ageRange' }] } },
        { or: { locales: [{ providerId: [] }] } },
        {
          or: {
            behaviors: [
              {
                providerId: '6002714898572',
                type: 'behaviors',
                path: ['Behaviours', 'Digital activities', 'Small business owners'],
                name: 'Small business owners',
                audienceSize: 48970322,
              },
            ],
            interests: [
              {
                providerId: '6002884511422',
                type: 'interests',
                path: ['Interests', 'Business and industry', 'Small business'],
                name: 'Small business',
                audienceSize: 192686100.5,
              },
            ],
            employers: [
              {
                providerId: '109288035760640',
                type: 'employers',
                path: ['Demographics', 'Work', 'Employers', 'Business Owner'],
                name: 'Business Owner',
                audienceSize: 116699,
              },
              {
                providerId: '112168642212790',
                type: 'employers',
                path: ['work_employers'],
                name: 'Small Business owner',
              },
            ],
          },
        },
        {
          or: {
            interests: [
              {
                providerId: '6002964301046',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Business school'],
                name: 'Business school',
                audienceSize: 41083805,
              },
            ],
            fieldsOfStudy: [
              {
                providerId: '106335129403847',
                type: 'fieldsOfStudy',
                path: ['Demographics', 'Education', 'Fields of study', 'Business management'],
                name: 'Business management',
                audienceSize: 2636510.5,
              },
            ],
            educationStatuses: [{ type: 'educationStatuses', providerId: '' }],
          },
        },
        {
          or: {
            interests: [
              {
                providerId: '6002964301046',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Business school'],
                name: 'Business school',
                audienceSize: 41083805,
              },
              {
                providerId: '6003304824460',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Distance education'],
                name: 'Distance education',
                audienceSize: 58894087.5,
              },
              {
                providerId: '6003333602237',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Online learning community'],
                name: 'Online learning community',
                audienceSize: 7387138.5,
              },
              {
                providerId: '6003373318975',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Virtual learning environment'],
                name: 'Virtual learning environment',
                audienceSize: 1470629.5,
              },
              {
                providerId: '6003490851457',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'ALISON - Free Online Courses'],
                name: 'ALISON - Free Online Courses',
                audienceSize: 1924,
              },
              {
                providerId: '6003559352865',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Udemy'],
                name: 'Udemy',
                audienceSize: 20411111,
              },
              {
                providerId: '6004765395213',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Codecademy'],
                name: 'Codecademy',
                audienceSize: 1847916,
              },
              {
                providerId: '6005577919198',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Udacity'],
                name: 'Udacity',
                audienceSize: 6569904.5,
              },
              {
                providerId: '6007069252238',
                type: 'interests',
                path: ['Interests', 'Additional interests', 'Coursera'],
                name: 'Coursera',
                audienceSize: 4286775.5,
              },
            ],
            employers: [
              {
                providerId: '116050848438791',
                type: 'employers',
                path: ['Demographics', 'Work', 'Employers', 'Currently looking for a job.'],
                name: 'Currently looking for a job.',
                audienceSize: 3339.5,
              },
            ],
          },
        },
      ],
    },
    exclude: {
      or: {
        behaviors: [
          {
            providerId: '6071631541183',
            type: 'behaviors',
            path: ['Behaviours', 'Purchase behaviour', 'Engaged shoppers'],
            name: 'Engaged shoppers',
            audienceSize: 539317289.5,
          },
          {
            providerId: '123456',
            type: 'behaviors',
            path: ['Behaviours'],
            name: 'test',
            audienceSize: 123456,
          },
        ],
        demographics: [
          {
            providerId: '654321',
            type: 'demographics',
            path: ['Demographics'],
            name: 'test 2',
            audienceSize: 654321,
          },
        ],
        interests: [
          {
            providerId: '123654',
            type: 'interests',
            path: ['Interests'],
            name: 'test 2',
            audienceSize: 321654,
          },
        ],
      },
    },
  },
  topics: ['business', 'director', 'owners', 'marketing', 'managing'],
  rank: 61,
  specRatio: { interests: 90, demographics: 10, behaviors: 0 },
  userTags: [
    'gambling',
    'football betting',
    'soccer betting',
    'Engaged Shoppers on Facebooks',
    'NBA fans',
    'motor racing',
    'horse racing',
  ],
};

export const citiesWithoutCountriesSearchResult: SearchResult = {
  id: '2225d350-d370-5f7e-b156-e155ed29babd',
  spec: {
    provider: SupportedProviders.FACEBOOK,
    include: {
      and: [
        { or: { ageRange: [{ providerId: '(18,65)', type: 'ageRange' }] } },
        { or: { locales: [{ providerId: [] }] } },
        {
          or: {
            cities: [
              {
                key: '777934',
                name: 'Paris',
                providerId: '777934',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '673453',
                name: 'Barcelona',
                providerId: '673453',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '812057',
                name: 'London',
                providerId: '812057',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '579270',
                name: 'Munich',
                providerId: '579270',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '1184376',
                name: 'Milan',
                providerId: '1184376',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '1648400',
                name: 'Amsterdam',
                providerId: '1648400',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '312303',
                name: 'Schlieren, Zurich',
                providerId: '312303',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '653929',
                name: 'Tallinn',
                providerId: '653929',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '609672',
                name: 'Copenhagen',
                providerId: '609672',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '717300',
                name: 'Helsinki',
                providerId: '717300',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '184329',
                name: 'Sint-Jans-Molenbeek, Brabant',
                providerId: '184329',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '689194',
                name: 'Madrid',
                providerId: '689194',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '1015162',
                name: 'Tel Aviv',
                providerId: '1015162',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2421215',
                name: 'Palo Alto',
                providerId: '2421215',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2421836',
                name: 'San Francisco',
                providerId: '2421836',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2420379',
                name: 'Los Angeles',
                providerId: '2420379',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2490299',
                name: 'New York',
                providerId: '2490299',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2428987',
                name: 'Miami',
                providerId: '2428987',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2464828',
                name: 'Boston',
                providerId: '2464828',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2542527',
                name: 'Seattle',
                providerId: '2542527',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2447960',
                name: 'Tampa',
                providerId: '2447960',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2512136',
                name: 'Portland',
                providerId: '2512136',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '2525495',
                name: 'Austin',
                providerId: '2525495',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '114925',
                name: 'Sydney',
                providerId: '114925',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '296875',
                name: 'Toronto',
                providerId: '296875',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
              {
                key: '296995',
                name: 'Vancouver',
                providerId: '296995',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'city',
                providerType: 'adgeolocation',
                type: 'cities',
              },
            ],
            regions: [
              {
                key: '840',
                name: 'Berlin',
                providerId: '840',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '828',
                name: 'Hamburg',
                providerId: '828',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '129',
                name: 'Vienna',
                providerId: '129',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '3274',
                name: 'Stockholm County',
                providerId: '3274',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '1696',
                name: 'County Dublin',
                providerId: '1696',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '1922',
                name: 'Tokyo',
                providerId: '1922',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '2004',
                name: 'Seoul',
                providerId: '2004',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '5000',
                name: 'Hong Kong',
                providerId: '5000',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
              {
                key: '10',
                name: 'Dubai',
                providerId: '10',
                included: true,
                type: 'regions',
                providerSubType: 'regions',
              },
            ],
            countries: [
              {
                providerId: 'TW',
                name: 'Taiwan, Province of China',
                countryCode: 'TW',
                countryName: 'Taiwan, Province of China',
                providerType: 'adgeolocation',
                included: true,
                supportsCity: true,
                supportsRegion: true,
                providerSubType: 'country',
                type: 'countries',
              },
            ],
            locationTypes: [{ providerId: 'home' }, { providerId: 'recent' }],
          },
        },
      ],
    },
    exclude: {
      or: {},
    },
  },
  topics: ['marketing', 'advertising', 'business', 'technologies', 'programming'],
  userTags: [
    'tech hubs',
    'startups',
    'techies',
    'tech',
    'IT experts',
    'IT',
    'Tech Entrepreneurs',
    'Entrepreneurs',
    'IT Companies',
    'Technology early adopters',
    'Business page admins',
    'tech decision makers',
    'global tech hubs',
    'tech hubs worldwide',
    'Frequent Travelers',
    'Engaged Shoppers',
  ],
  rank: 0,
  specRatio: { interests: 77, demographics: 22, behaviors: 2 },
};

export const mockSearchResults: SearchResult[] = [
  regularSearchResult,
  {
    id: 'b4b4016c-41dc-47cb-85e3-c61ee3650fdc',
    spec: {
      provider: SupportedProviders.FACEBOOK,
      include: {
        and: [
          { or: { ageRange: [{ providerId: '(30,60)', type: 'ageRange' }] } },
          { or: { locales: [{ providerId: [] }] } },
          {
            or: {
              interests: [
                {
                  providerId: '123456789',
                  type: 'interests',
                  path: ['TEST', 'TEST', 'TEST'],
                  name: 'TEST',
                  audienceSize: 855532.5,
                },
                {
                  providerId: '9876354321',
                  type: 'interests',
                  path: ['TEST', 'TEST', 'TEST'],
                  name: 'TEST',
                  audienceSize: 402282,
                },
              ],
              workPositions: [
                {
                  providerId: '105563979478424',
                  type: 'workPositions',
                  path: ['Demographics', 'Work', 'Job titles', 'Executive director'],
                  name: 'Executive director',
                  audienceSize: 310938.5,
                },
              ],
            },
          },
        ],
      },
      exclude: { or: {} },
    },
    topics: ['topic 1', 'topic 2', 'topic 3'],
    rank: 51,
    specRatio: { interests: 100, demographics: 0, behaviors: 0 },
    userTags: ['tag 1', 'tag 2', 'tag 3'],
  },
  {
    id: 'b4b4016c-41dc-47cb-85e3-c61ee3650fd9',
    spec: {
      provider: SupportedProviders.FACEBOOK,
      include: {
        and: [
          { or: { ageRange: [{ providerId: '(10,80)', type: 'ageRange' }] } },
          { or: { locales: [{ providerId: [] }] } },
          {
            or: {
              interests: [
                {
                  providerId: '123456789',
                  type: 'interests',
                  path: ['TEST', 'TEST', 'TEST'],
                  name: 'TEST',
                  audienceSize: 855532.5,
                },
                {
                  providerId: '9876354321',
                  type: 'interests',
                  path: ['TEST', 'TEST', 'TEST'],
                  name: 'TEST',
                  audienceSize: 402282,
                },
              ],
            },
          },
        ],
      },
      exclude: { or: {} },
    },
    topics: ['topic 4', 'topic 5', 'topic 6'],
    rank: 51,
    specRatio: { interests: 100, demographics: 0, behaviors: 0 },
    userTags: ['tag 4', 'tag 5', 'tag 6'],
  },
];

export const mockSelectedAudiences: SearchResult[] = [
  regularSearchResult,
  // selectTagsSearchResult,
  // ...mockSearchResults,
  // multipleOrSearchResult,
  // pathMergeSearchResult,
  // noPathSearchResult,
];

export const mockSearchResultsForTags: SearchResult[] = [
  {
    id: 'b4b4016c-41dc-47cb-85e3-c61ee3650fdc',
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
    rank: 51,
    specRatio: { interests: 100, demographics: 0, behaviors: 0 },
    userTags: ['test 1', 'test 2'],
  },
  {
    id: 'b4b4016c-41dc-47cb-85e3-c61ee3650fd9',
    spec: {
      provider: SupportedProviders.FACEBOOK,
      include: {
        and: [
          { or: { ageRange: [{ providerId: '(10,80)', type: 'ageRange' }] } },
          { or: { locales: [{ providerId: [] }] } },
          { or: {} },
        ],
      },
      exclude: { or: {} },
    },
    topics: [],
    rank: 51,
    specRatio: { interests: 100, demographics: 0, behaviors: 0 },
    userTags: ['test 3', 'test 4'],
  },
];
