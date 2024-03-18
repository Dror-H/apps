import { SearchResult } from 'apps/audiences-api/src/app/shared/model';

export const mockMergedSingleAudience: SearchResult = {
  id: '38fe6309-9085-5711-8bf7-a80f7cf38877',
  createdByContributors: false,
  spec: {
    id: '154728e7-d715-47d9-aabd-8b97903a7362',
    name: '',
    targeting: {
      age_max: 65,
      age_min: 18,
      locales: [],
      exclusions: {
        interests: [
          {
            id: '6003323121909',
            name: 'forex trader',
            audience_size_lower_bound: 0,
            audience_size_upper_bound: 100,
            path: ['trade'],
            description: 'description',
            topic: 'trade',
          },
        ],
        work_employers: [
          {
            id: '53055982556',
            name: 'Crypto Trading',
            audience_size_lower_bound: 0,
            audience_size_upper_bound: 100,
            path: ['trade'],
            description: 'description',
            topic: 'trade',
          },
        ],
        education_statuses: [4, 5, 2, 100],
      },
      flexible_spec: [
        {
          interests: [
            {
              id: '6003181353933',
              name: 'Podcast',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 100,
              path: ['trade'],
              description: 'description',
              topic: 'trade',
            },
          ],
          college_years: [2022, 2023, 2024, 2025, 2026],
        },
        {
          interests: [
            {
              id: '6003567719718',
              name: 'Gold',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 100,
              path: ['trade'],
              description: 'description',
              topic: 'trade',
            },
          ],
          work_employers: [
            {
              id: '108079109214403',
              name: 'Gold mining',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 100,
              path: ['trade'],
              description: 'description',
              topic: 'trade',
            },
          ],
        },
        {
          interests: [
            {
              id: '6004391943557',
              name: 'Doomsday Preppers',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 100,
              path: ['trade'],
              description: 'description',
              topic: 'trade',
            },
          ],
        },
      ],
      geo_locations: {
        countries: ['US'],
        location_types: ['home', 'recent'],
        cities: [],
        neighborhoods: [],
        places: [],
        regions: [],
      },
      targeting_optimization: 'none',
    },
  },
  userTags: [
    'gold',
    'gold investors',
    'gold bugs',
    'gold and silver',
    'silver bugs',
    'silver investors',
    'precious metals',
    'economy',
    'Doomsday Preppers',
    'podcasts lovers',
    'Survival ',
  ],
  topics: ['survival', 'gold', 'silver', 'radio', 'preppers'],
  rank: 100,
};

export const AudiencesToMerge = [
  {
    id: '72cb7d01-afc5-530d-8e02-8cf308e61fc0',
    createdByContributors: false,
    spec: {
      id: '959dfa09-6109-4dc6-af4f-8bb0baeb8ca2',
      name: '',
      targeting: {
        age_max: 65,
        age_min: 18,
        genders: [0],
        locales: [],
        exclusions: {
          interests: [
            {
              id: '6003323121909',
              name: 'forex trader',
            },
            {
              id: '6003264714675',
              name: 'Forex signal',
            },
            {
              id: '6017013316940',
              name: 'FOREX.com',
            },
            {
              id: '6003549338642',
              name: 'EToro',
            },
          ],
          college_years: [2022, 2023, 2024, 2025, 2026],
          work_employers: [
            {
              id: '53055982556',
              name: 'Crypto Trading',
            },
            {
              id: '111027395599338',
              name: 'Forex Trader',
            },
          ],
          work_positions: [
            {
              id: '417494741741948',
              name: 'Forex Trader',
            },
          ],
        },
        flexible_spec: [
          {
            interests: [
              {
                id: '6003331700032',
                name: 'Economy',
              },
              {
                id: '6003126666749',
                name: 'Sharing economy',
              },
              {
                id: '6003583810673',
                name: 'Political economy',
              },
              {
                id: '6003656112304',
                name: 'Economics',
              },
              {
                id: '6003462661944',
                name: 'Trade',
              },
              {
                id: '6003393771563',
                name: 'Market (economics)',
              },
              {
                id: '6006252868071',
                name: 'Consulting firm',
              },
              {
                id: '6003484864669',
                name: 'Wealth management',
              },
              {
                id: '6003439974531',
                name: 'Morgan Stanley Wealth Management',
              },
              {
                id: '6003063638807',
                name: 'Investment banking',
              },
              {
                id: '6003605946020',
                name: 'Commodity market',
              },
              {
                id: '6003107475701',
                name: 'National Commodity and Derivatives Exchange',
              },
              {
                id: '6003009721650',
                name: 'Multi Commodity Exchange',
              },
              {
                id: '6003483797198',
                name: 'Geopolitics',
              },
            ],
          },
          {
            interests: [
              {
                id: '6003567719718',
                name: 'Gold',
              },
              {
                id: '6003422002289',
                name: 'Gold mining',
              },
              {
                id: '6003456044303',
                name: 'Mining',
              },
              {
                id: '6003399993763',
                name: 'Silver',
              },
              {
                id: '6003030526807',
                name: 'Sterling silver',
              },
            ],
            work_employers: [
              {
                id: '108079109214403',
                name: 'Gold mining',
              },
            ],
          },
          {
            income: [
              {
                id: '6107813554583',
                name: 'Household income: top 25%-50% of ZIP codes (US)',
              },
              {
                id: '6107813553183',
                name: 'Household income: top 10%-25% of ZIP codes (US)',
              },
              {
                id: '6107813551783',
                name: 'Household income: top 10% of ZIP codes (US)',
              },
              {
                id: '6107813079183',
                name: 'Household income: top 5% of ZIP codes (US)',
              },
            ],
            behaviors: [
              {
                id: '6071631541183',
                name: 'Engaged Shoppers',
              },
              {
                id: '6002714895372',
                name: 'Frequent Travelers',
              },
            ],
            education_statuses: ['9', '3', '11'],
          },
          {
            interests: [
              {
                id: '6003342216187',
                name: 'Self-defense',
              },
              {
                id: '6003422105489',
                name: 'Self-confidence',
              },
              {
                id: '6003713580353',
                name: 'Survival skills',
              },
              {
                id: '6003325921006',
                name: 'Survival kit',
              },
              {
                id: '6011886640554',
                name: 'Homestead Survival',
              },
              {
                id: '6003234265649',
                name: 'Camping Survival',
              },
              {
                id: '6003375978181',
                name: 'Survivalism',
              },
              {
                id: '6003160062408',
                name: 'Bug-out bag',
              },
              {
                id: '6003368431602',
                name: 'Camping World',
              },
              {
                id: '6003629175183',
                name: 'Tent',
              },
              {
                id: '6003348662930',
                name: 'Camping',
              },
              {
                id: '6004391943557',
                name: 'Doomsday Preppers',
              },
              {
                id: '6003157928982',
                name: 'Camping and Caravanning Club',
              },
              {
                id: '6003467659764',
                name: 'Preparedness',
              },
              {
                id: '6003435423591',
                name: 'American Preppers Network',
              },
            ],
            work_employers: [
              {
                id: '97239338959',
                name: 'Smith & Wesson Inc.',
              },
              {
                id: '107625379266744',
                name: 'Smith & Wesson',
              },
              {
                id: '138343036024',
                name: 'Remington1816',
              },
            ],
            work_positions: [
              {
                id: '1570985966477594',
                name: 'Firearms Instructor',
              },
              {
                id: '44053938557',
                name: 'U.S. Army',
              },
              {
                id: '104009579636300',
                name: 'Army National Guard',
              },
            ],
          },
        ],
        geo_locations: {
          countries: ['US'],
          location_types: ['home', 'recent'],
        },
        excluded_geo_locations: {},
        targeting_optimization: 'none',
        excluded_custom_audiences: [],
      },
    },
    segments: [
      'Economy',
      'Sharing economy',
      'Political economy',
      'Economics',
      'Trade',
      'Market (economics)',
      'Consulting firm',
      'Wealth management',
      'Morgan Stanley Wealth Management',
      'Investment banking',
      'Commodity market',
      'National Commodity and Derivatives Exchange',
      'Multi Commodity Exchange',
      'Geopolitics',
      'Gold',
      'Gold mining',
      'Mining',
      'Silver',
      'Sterling silver',
      'Gold mining',
      'Household income: top 25%-50% of ZIP codes (US)',
      'Household income: top 10%-25% of ZIP codes (US)',
      'Household income: top 10% of ZIP codes (US)',
      'Household income: top 5% of ZIP codes (US)',
      'Engaged Shoppers',
      'Frequent Travelers',
      'Self-defense',
      'Self-confidence',
      'Survival skills',
      'Survival kit',
      'Homestead Survival',
      'Camping Survival',
      'Survivalism',
      'Bug-out bag',
      'Camping World',
      'Tent',
      'Camping',
      'Doomsday Preppers',
      'Camping and Caravanning Club',
      'Preparedness',
      'American Preppers Network',
      'Firearms Instructor',
      'U.S. Army',
      'Army National Guard',
      'Smith & Wesson Inc.',
      'Smith & Wesson',
      'Remington1816',
    ],
    userTags: [
      'gold',
      'gold investors',
      'gold bugs',
      'gold and silver',
      'silver bugs',
      'silver investors',
      'precious metals',
      'economy',
      'Doomsday Preppers',
    ],
    topics: ['survival', 'zip', 'top', 'income', 'household'],
  },
  {
    id: '2b9ac860-7094-51e7-a909-c9909589f2dc',
    createdByContributors: false,
    spec: {
      id: 'ecae111d-b0a3-418c-891a-c2323fea11d7',
      name: '',
      targeting: {
        age_max: 65,
        age_min: 18,
        genders: [0],
        locales: [],
        exclusions: {
          interests: [
            {
              id: '6003323121909',
              name: 'forex trader',
            },
            {
              id: '6003264714675',
              name: 'Forex signal',
            },
            {
              id: '6017013316940',
              name: 'FOREX.com',
            },
            {
              id: '6003549338642',
              name: 'EToro',
            },
          ],
          work_employers: [
            {
              id: '53055982556',
              name: 'Crypto Trading',
            },
            {
              id: '111027395599338',
              name: 'Forex Trader',
            },
          ],
          work_positions: [
            {
              id: '417494741741948',
              name: 'Forex Trader',
            },
          ],
        },
        flexible_spec: [
          {
            interests: [
              {
                id: '6003181353933',
                name: 'Podcast',
              },
              {
                id: '6003331700032',
                name: 'Economy',
              },
              {
                id: '6003656112304',
                name: 'Economics',
              },
              {
                id: '6004043092389',
                name: 'Audible.com',
              },
              {
                id: '6003074487739',
                name: 'E-books',
              },
              {
                id: '6003451861671',
                name: 'Radio broadcasting',
              },
              {
                id: '6002995703644',
                name: 'Talk radio',
              },
              {
                id: '6004158316095',
                name: 'YouTube',
              },
            ],
          },
          {
            interests: [
              {
                id: '6003567719718',
                name: 'Gold',
              },
              {
                id: '6003422002289',
                name: 'Gold mining',
              },
              {
                id: '6003456044303',
                name: 'Mining',
              },
              {
                id: '6003399993763',
                name: 'Silver',
              },
              {
                id: '6003030526807',
                name: 'Sterling silver',
              },
            ],
            work_employers: [
              {
                id: '108079109214403',
                name: 'Gold mining',
              },
            ],
          },
          {
            income: [
              {
                id: '6107813554583',
                name: 'Household income: top 25%-50% of ZIP codes (US)',
              },
              {
                id: '6107813553183',
                name: 'Household income: top 10%-25% of ZIP codes (US)',
              },
              {
                id: '6107813551783',
                name: 'Household income: top 10% of ZIP codes (US)',
              },
              {
                id: '6107813079183',
                name: 'Household income: top 5% of ZIP codes (US)',
              },
            ],
            behaviors: [
              {
                id: '6071631541183',
                name: 'Engaged Shoppers',
              },
              {
                id: '6002714895372',
                name: 'Frequent Travelers',
              },
            ],
            education_statuses: ['9', '3', '11'],
          },
          {
            interests: [
              {
                id: '6003342216187',
                name: 'Self-defense',
              },
              {
                id: '6003422105489',
                name: 'Self-confidence',
              },
              {
                id: '6003713580353',
                name: 'Survival skills',
              },
              {
                id: '6003325921006',
                name: 'Survival kit',
              },
              {
                id: '6011886640554',
                name: 'Homestead Survival',
              },
              {
                id: '6003234265649',
                name: 'Camping Survival',
              },
              {
                id: '6003375978181',
                name: 'Survivalism',
              },
              {
                id: '6003160062408',
                name: 'Bug-out bag',
              },
              {
                id: '6003368431602',
                name: 'Camping World',
              },
              {
                id: '6003629175183',
                name: 'Tent',
              },
              {
                id: '6003348662930',
                name: 'Camping',
              },
              {
                id: '6004391943557',
                name: 'Doomsday Preppers',
              },
              {
                id: '6003157928982',
                name: 'Camping and Caravanning Club',
              },
              {
                id: '6003467659764',
                name: 'Preparedness',
              },
              {
                id: '6003435423591',
                name: 'American Preppers Network',
              },
            ],
            work_employers: [
              {
                id: '97239338959',
                name: 'Smith & Wesson Inc.',
              },
              {
                id: '107625379266744',
                name: 'Smith & Wesson',
              },
              {
                id: '138343036024',
                name: 'Remington1816',
              },
            ],
            work_positions: [
              {
                id: '1570985966477594',
                name: 'Firearms Instructor',
              },
              {
                id: '44053938557',
                name: 'U.S. Army',
              },
              {
                id: '104009579636300',
                name: 'Army National Guard',
              },
            ],
          },
        ],
        geo_locations: {
          countries: ['US'],
          location_types: ['home', 'recent'],
        },
        excluded_geo_locations: {},
        targeting_optimization: 'none',
        excluded_custom_audiences: [],
      },
    },
    segments: [
      'Podcast',
      'Economy',
      'Economics',
      'Audible.com',
      'E-books',
      'Radio broadcasting',
      'Talk radio',
      'YouTube',
      'Gold',
      'Gold mining',
      'Mining',
      'Silver',
      'Sterling silver',
      'Gold mining',
      'Household income: top 25%-50% of ZIP codes (US)',
      'Household income: top 10%-25% of ZIP codes (US)',
      'Household income: top 10% of ZIP codes (US)',
      'Household income: top 5% of ZIP codes (US)',
      'Engaged Shoppers',
      'Frequent Travelers',
      'Self-defense',
      'Self-confidence',
      'Survival skills',
      'Survival kit',
      'Homestead Survival',
      'Camping Survival',
      'Survivalism',
      'Bug-out bag',
      'Camping World',
      'Tent',
      'Camping',
      'Doomsday Preppers',
      'Camping and Caravanning Club',
      'Preparedness',
      'American Preppers Network',
      'Firearms Instructor',
      'U.S. Army',
      'Army National Guard',
      'Smith & Wesson Inc.',
      'Smith & Wesson',
      'Remington1816',
    ],
    userTags: [
      'gold',
      'gold investors',
      'gold bugs',
      'gold and silver',
      'silver bugs',
      'silver investors',
      'precious metals',
      'economy',
      'Doomsday Preppers',
    ],
    topics: ['survival', 'zip', 'top', 'income', 'household'],
  },
  {
    id: 'dd909550-c790-5afe-b297-dfe1fa899206',
    createdByContributors: false,
    spec: {
      id: '4d2156c2-293b-4653-97ae-d8d79435caa1',
      name: '',
      targeting: {
        age_max: 65,
        age_min: 18,
        genders: [0],
        locales: [],
        exclusions: {
          interests: [
            {
              id: '6003323121909',
              name: 'forex trader',
            },
            {
              id: '6003264714675',
              name: 'Forex signal',
            },
            {
              id: '6017013316940',
              name: 'FOREX.com',
            },
            {
              id: '6003549338642',
              name: 'EToro',
            },
          ],
          work_employers: [
            {
              id: '53055982556',
              name: 'Crypto Trading',
            },
            {
              id: '111027395599338',
              name: 'Forex Trader',
            },
          ],
          work_positions: [
            {
              id: '417494741741948',
              name: 'Forex Trader',
            },
          ],
        },
        flexible_spec: [
          {
            interests: [
              {
                id: '6003181353933',
                name: 'Podcast',
              },
              {
                id: '6003451861671',
                name: 'Radio broadcasting',
              },
              {
                id: '6002995703644',
                name: 'Talk radio',
              },
              {
                id: '6003227911299',
                name: 'Rich Dad',
              },
              {
                id: '6003047745129',
                name: 'Robert Kiyosaki',
              },
              {
                id: '6003107202901',
                name: 'Broadcasting',
              },
              {
                id: '6003288802651',
                name: 'Audiobook',
              },
              {
                id: '6003287729076',
                name: 'Passive income',
              },
              {
                id: '6004043092389',
                name: 'Audible.com',
              },
              {
                id: '6003074487739',
                name: 'E-books',
              },
              {
                id: '6004158316095',
                name: 'YouTube',
              },
            ],
          },
          {
            interests: [
              {
                id: '6003567719718',
                name: 'Gold',
              },
              {
                id: '6003422002289',
                name: 'Gold mining',
              },
              {
                id: '6003456044303',
                name: 'Mining',
              },
              {
                id: '6003399993763',
                name: 'Silver',
              },
              {
                id: '6003030526807',
                name: 'Sterling silver',
              },
            ],
          },
          {
            interests: [
              {
                id: '6004391943557',
                name: 'Doomsday Preppers',
              },
              {
                id: '6003325921006',
                name: 'Survival kit',
              },
              {
                id: '6003375978181',
                name: 'Survivalism',
              },
              {
                id: '6003435423591',
                name: 'American Preppers Network',
              },
              {
                id: '6003467659764',
                name: 'Preparedness',
              },
              {
                id: '6003713580353',
                name: 'Survival skills',
              },
              {
                id: '6003160062408',
                name: 'Bug-out bag',
              },
              {
                id: '6003342264387',
                name: 'Survivorman',
              },
              {
                id: '6003348662930',
                name: 'Camping',
              },
              {
                id: '6003497152225',
                name: 'Homesteading',
              },
              {
                id: '6003446468680',
                name: 'Man vs. Wild',
              },
              {
                id: '6003342216187',
                name: 'Self-defense',
              },
              {
                id: '6003455510803',
                name: 'Bear Grylls',
              },
              {
                id: '6003405972606',
                name: 'Krav Maga',
              },
              {
                id: '6003224130745',
                name: 'Kickboxing',
              },
              {
                id: '6003110460645',
                name: 'Mixed martial arts',
              },
              {
                id: '6002868021822',
                name: 'Adventure travel',
              },
              {
                id: '6003142844668',
                name: 'Martial arts',
              },
              {
                id: '6002927007962',
                name: 'Saving',
              },
              {
                id: '6003430240540',
                name: 'MoneySavingExpert.com',
              },
              {
                id: '6003243085588',
                name: 'Savings.com',
              },
              {
                id: '6002898227362',
                name: 'Combat sport',
              },
              {
                id: '6003179178152',
                name: 'Brazilian jiu-jitsu',
              },
              {
                id: '6003397561547',
                name: 'Karate',
              },
              {
                id: '6003228100899',
                name: 'Judo',
              },
              {
                id: '6003141366426',
                name: 'Jujutsu',
              },
              {
                id: '6003328343545',
                name: 'Taekwondo',
              },
              {
                id: '6003313485580',
                name: 'Aikido',
              },
              {
                id: '6003342271387',
                name: 'Grappling',
              },
              {
                id: '6003257940888',
                name: 'Chinese martial arts',
              },
              {
                id: '6003227872499',
                name: 'Wrestling',
              },
            ],
          },
        ],
        geo_locations: {
          countries: ['US'],
          location_types: ['home', 'recent'],
        },
        excluded_geo_locations: {},
        targeting_optimization: 'none',
        excluded_custom_audiences: [],
      },
    },
    segments: [
      'Podcast',
      'Radio broadcasting',
      'Talk radio',
      'Rich Dad',
      'Robert Kiyosaki',
      'Broadcasting',
      'Audiobook',
      'Passive income',
      'Audible.com',
      'E-books',
      'YouTube',
      'Gold',
      'Gold mining',
      'Mining',
      'Silver',
      'Sterling silver',
      'Doomsday Preppers',
      'Survival kit',
      'Survivalism',
      'American Preppers Network',
      'Preparedness',
      'Survival skills',
      'Bug-out bag',
      'Survivorman',
      'Camping',
      'Homesteading',
      'Man vs. Wild',
      'Self-defense',
      'Bear Grylls',
      'Krav Maga',
      'Kickboxing',
      'Mixed martial arts',
      'Adventure travel',
      'Martial arts',
      'Saving',
      'MoneySavingExpert.com',
      'Savings.com',
      'Combat sport',
      'Brazilian jiu-jitsu',
      'Karate',
      'Judo',
      'Jujutsu',
      'Taekwondo',
      'Aikido',
      'Grappling',
      'Chinese martial arts',
      'Wrestling',
    ],
    userTags: [
      'gold',
      'gold investors',
      'gold bugs',
      'gold and silver',
      'silver bugs',
      'silver investors',
      'precious metals',
      'economy',
      'Doomsday Preppers',
      'podcasts lovers',
      'Survival ',
    ],
    topics: ['survival', 'martial', 'arts', 'silver', 'radio'],
  },
];

export const expectedMergedAudience = {
  id: 'd9b2606f-65bb-4817-a217-361523ee049a',
  spec: {
    id: 'd9b2606f-65bb-4817-a217-361523ee049a',
    name: 'MERGE',
    targeting: {
      flexible_spec: [
        {
          interests: [
            {
              id: '6003331700032',
              name: 'Economy',
            },
            {
              id: '6003126666749',
              name: 'Sharing economy',
            },
            {
              id: '6003583810673',
              name: 'Political economy',
            },
            {
              id: '6003656112304',
              name: 'Economics',
            },
            {
              id: '6003462661944',
              name: 'Trade',
            },
            {
              id: '6003393771563',
              name: 'Market (economics)',
            },
            {
              id: '6006252868071',
              name: 'Consulting firm',
            },
            {
              id: '6003484864669',
              name: 'Wealth management',
            },
            {
              id: '6003439974531',
              name: 'Morgan Stanley Wealth Management',
            },
            {
              id: '6003063638807',
              name: 'Investment banking',
            },
            {
              id: '6003605946020',
              name: 'Commodity market',
            },
            {
              id: '6003107475701',
              name: 'National Commodity and Derivatives Exchange',
            },
            {
              id: '6003009721650',
              name: 'Multi Commodity Exchange',
            },
            {
              id: '6003483797198',
              name: 'Geopolitics',
            },
            {
              id: '6003181353933',
              name: 'Podcast',
            },
            {
              id: '6004043092389',
              name: 'Audible.com',
            },
            {
              id: '6003074487739',
              name: 'E-books',
            },
            {
              id: '6003451861671',
              name: 'Radio broadcasting',
            },
            {
              id: '6002995703644',
              name: 'Talk radio',
            },
            {
              id: '6004158316095',
              name: 'YouTube',
            },
            {
              id: '6003227911299',
              name: 'Rich Dad',
            },
            {
              id: '6003047745129',
              name: 'Robert Kiyosaki',
            },
            {
              id: '6003107202901',
              name: 'Broadcasting',
            },
            {
              id: '6003288802651',
              name: 'Audiobook',
            },
            {
              id: '6003287729076',
              name: 'Passive income',
            },
          ],
        },
        {
          interests: [
            {
              id: '6003567719718',
              name: 'Gold',
            },
            {
              id: '6003422002289',
              name: 'Gold mining',
            },
            {
              id: '6003456044303',
              name: 'Mining',
            },
            {
              id: '6003399993763',
              name: 'Silver',
            },
            {
              id: '6003030526807',
              name: 'Sterling silver',
            },
          ],
          work_employers: [
            {
              id: '108079109214403',
              name: 'Gold mining',
            },
          ],
        },
        {
          income: [
            {
              id: '6107813554583',
              name: 'Household income: top 25%-50% of ZIP codes (US)',
            },
            {
              id: '6107813553183',
              name: 'Household income: top 10%-25% of ZIP codes (US)',
            },
            {
              id: '6107813551783',
              name: 'Household income: top 10% of ZIP codes (US)',
            },
            {
              id: '6107813079183',
              name: 'Household income: top 5% of ZIP codes (US)',
            },
          ],
          behaviors: [
            {
              id: '6071631541183',
              name: 'Engaged Shoppers',
            },
            {
              id: '6002714895372',
              name: 'Frequent Travelers',
            },
          ],
          education_statuses: ['9', '3', '11'],
          interests: [
            {
              id: '6004391943557',
              name: 'Doomsday Preppers',
            },
            {
              id: '6003325921006',
              name: 'Survival kit',
            },
            {
              id: '6003375978181',
              name: 'Survivalism',
            },
            {
              id: '6003435423591',
              name: 'American Preppers Network',
            },
            {
              id: '6003467659764',
              name: 'Preparedness',
            },
            {
              id: '6003713580353',
              name: 'Survival skills',
            },
            {
              id: '6003160062408',
              name: 'Bug-out bag',
            },
            {
              id: '6003342264387',
              name: 'Survivorman',
            },
            {
              id: '6003348662930',
              name: 'Camping',
            },
            {
              id: '6003497152225',
              name: 'Homesteading',
            },
            {
              id: '6003446468680',
              name: 'Man vs. Wild',
            },
            {
              id: '6003342216187',
              name: 'Self-defense',
            },
            {
              id: '6003455510803',
              name: 'Bear Grylls',
            },
            {
              id: '6003405972606',
              name: 'Krav Maga',
            },
            {
              id: '6003224130745',
              name: 'Kickboxing',
            },
            {
              id: '6003110460645',
              name: 'Mixed martial arts',
            },
            {
              id: '6002868021822',
              name: 'Adventure travel',
            },
            {
              id: '6003142844668',
              name: 'Martial arts',
            },
            {
              id: '6002927007962',
              name: 'Saving',
            },
            {
              id: '6003430240540',
              name: 'MoneySavingExpert.com',
            },
            {
              id: '6003243085588',
              name: 'Savings.com',
            },
            {
              id: '6002898227362',
              name: 'Combat sport',
            },
            {
              id: '6003179178152',
              name: 'Brazilian jiu-jitsu',
            },
            {
              id: '6003397561547',
              name: 'Karate',
            },
            {
              id: '6003228100899',
              name: 'Judo',
            },
            {
              id: '6003141366426',
              name: 'Jujutsu',
            },
            {
              id: '6003328343545',
              name: 'Taekwondo',
            },
            {
              id: '6003313485580',
              name: 'Aikido',
            },
            {
              id: '6003342271387',
              name: 'Grappling',
            },
            {
              id: '6003257940888',
              name: 'Chinese martial arts',
            },
            {
              id: '6003227872499',
              name: 'Wrestling',
            },
          ],
        },
        {
          interests: [
            {
              id: '6003422105489',
              name: 'Self-confidence',
            },
            {
              id: '6011886640554',
              name: 'Homestead Survival',
            },
            {
              id: '6003234265649',
              name: 'Camping Survival',
            },
            {
              id: '6003368431602',
              name: 'Camping World',
            },
            {
              id: '6003629175183',
              name: 'Tent',
            },
            {
              id: '6003157928982',
              name: 'Camping and Caravanning Club',
            },
          ],
          work_employers: [
            {
              id: '97239338959',
              name: 'Smith & Wesson Inc.',
            },
            {
              id: '107625379266744',
              name: 'Smith & Wesson',
            },
            {
              id: '138343036024',
              name: 'Remington1816',
            },
          ],
          work_positions: [
            {
              id: '1570985966477594',
              name: 'Firearms Instructor',
            },
            {
              id: '44053938557',
              name: 'U.S. Army',
            },
            {
              id: '104009579636300',
              name: 'Army National Guard',
            },
          ],
        },
      ],
      exclusions: {
        interests: [
          {
            id: '6003323121909',
            name: 'forex trader',
          },
          {
            id: '6003264714675',
            name: 'Forex signal',
          },
          {
            id: '6017013316940',
            name: 'FOREX.com',
          },
          {
            id: '6003549338642',
            name: 'EToro',
          },
        ],
        work_employers: [
          {
            id: '53055982556',
            name: 'Crypto Trading',
          },
          {
            id: '111027395599338',
            name: 'Forex Trader',
          },
        ],
        work_positions: [
          {
            id: '417494741741948',
            name: 'Forex Trader',
          },
        ],
      },
      geo_locations: {
        countries: ['US'],
        location_types: ['home', 'recent'],
      },
      locales: [],
    },
  },
  userTags: [
    'gold',
    'gold investors',
    'gold bugs',
    'gold and silver',
    'silver bugs',
    'silver investors',
    'precious metals',
    'economy',
    'Doomsday Preppers',
    'podcasts lovers',
    'Survival ',
  ],
  topics: ['survival', 'zip', 'top', 'income', 'household', 'martial', 'arts', 'silver', 'radio'],
  createdByContributors: false,
  rank: 0,
};
