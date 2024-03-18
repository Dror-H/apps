export const mockSearchResults = [
  {
    id: '4870eab0-7ed2-56b1-9493-5b4684a7b03c',
    createdByContributors: false,
    spec: {
      id: '0478f7d5-55c7-4106-ba34-4f691236969c',
      name: '',
      targeting: {
        age_max: 65,
        age_min: 18,
        genders: [0],
        locales: [],
        exclusions: {},
        flexible_spec: [
          {
            work_positions: [
              {
                id: '105703889464434',
                name: 'Motivational speaker',
              },
              {
                id: '839841992748313',
                name: 'Personal Coach',
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
    segments: [],
    userTags: [],
    topics: [],
  },
  {
    id: '478605de-ba43-5d8c-9c52-b1043e4cc0b7',
    createdByContributors: false,
    spec: {
      id: '23848984859650054',
      name: 'Interest Jewellry - UK - 18+ – Copy',
      campaign: {
        id: '23848984859400054',
        name: 'SO - Conversions - Bracelet - CBO - UK Only',
      },
      targeting: {
        age_max: 65,
        age_min: 35,
        genders: [2],
        exclusions: {
          interests: [
            {
              id: '6003109292833',
              name: 'Drop shipping',
            },
            {
              id: '6019154143076',
              name: 'AliExpress',
            },
          ],
        },
        flexible_spec: [
          {
            interests: [
              {
                id: '6003266225248',
                name: 'Jewellery',
              },
            ],
          },
        ],
        geo_locations: {
          countries: ['GB'],
          location_types: ['home', 'recent'],
        },
        brand_safety_content_filter_levels: ['FACEBOOK_STANDARD', 'AN_STANDARD'],
      },
    },
    segments: ['SO - Conversions - Bracelet - CBO - UK Only', 'Interest Jewellry - UK - 18+ – Copy', 'Jewellery'],
    userTags: [],
    topics: ['uk', 'jewellry', 'jewellery', 'interest', 'copy'],
  },
];

export const mockEmptyFlexSpecAndExclusions = {
  id: '478605de-ba43-5d8c-9c52-b1043e4cc0b7',
  createdByContributors: false,
  spec: {
    id: '23848984859650054',
    name: 'Interest Jewellry - UK - 18+ – Copy',
    campaign: {
      id: '23848984859400054',
      name: 'SO - Conversions - Bracelet - CBO - UK Only',
    },
    targeting: {
      age_max: 65,
      age_min: 35,
      genders: [2],
      exclusions: {
        interests: [],
        work_employers: [],
      },
      flexible_spec: [
        {
          interests: [],
          work_positions: [],
        },
      ],
      geo_locations: {
        countries: ['GB'],
        location_types: ['home', 'recent'],
      },
      brand_safety_content_filter_levels: ['FACEBOOK_STANDARD', 'AN_STANDARD'],
    },
  },
  segments: ['SO - Conversions - Bracelet - CBO - UK Only', 'Interest Jewellry - UK - 18+ – Copy', 'Jewellery'],
  userTags: [],
  topics: ['uk', 'jewellry', 'jewellery', 'interest', 'copy'],
};
