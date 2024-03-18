import { SearchResult, FlexibleSpec, Targeting } from './../../shared/model';

export const flexSpecsNullSegments: FlexibleSpec[] = [
  {
    interests: [
      {
        id: '1',
        name: '',
        audience_size_lower_bound: 0,
        audience_size_upper_bound: 0,
        path: ['test'],
        description: 'double location = exclusion.interests[1]',
        topic: 'test',
      },
    ],
    family_statuses: [null],
  },
  {
    interests: [null],
    family_statuses: [
      {
        id: '1',
        name: '',
        audience_size_lower_bound: 0,
        audience_size_upper_bound: 0,
        path: ['test'],
        description: 'double location = exclusion.interests[1]',
        topic: 'test',
      },
    ],
  },
];

export const targetingNullSegments: Targeting = {
  exclusions: {
    interests: [
      {
        id: '1',
        name: '',
        audience_size_lower_bound: 0,
        audience_size_upper_bound: 0,
        path: ['test'],
        description: 'double location = flexible_spec.interests[0]',
        topic: 'test',
      },
      {
        id: '2',
        name: '',
        audience_size_lower_bound: 0,
        audience_size_upper_bound: 0,
        path: ['test'],
        description: 'double location = exclusion.interests[2]',
        topic: 'test',
      },
      null,
    ],
    family_statuses: [null],
  },
  flexible_spec: [
    {
      interests: [
        {
          id: '1',
          name: '',
          audience_size_lower_bound: 0,
          audience_size_upper_bound: 0,
          path: ['test'],
          description: 'double location = exclusion.interests[1]',
          topic: 'test',
        },
      ],
      family_statuses: [null],
    },
    {
      interests: [
        {
          id: '2',
          name: '',
          audience_size_lower_bound: 0,
          audience_size_upper_bound: 0,
          path: ['test'],
          description: 'double location = exclusion.interests[1]',
          topic: 'test',
        },
      ],
      work_employers: [null],
    },
  ],
};

export const mockIncludesSegmentIfInExclusion: SearchResult = {
  id: '38fe6309-9085-5711-8bf7-a80f7cf38877',
  createdByContributors: false,
  spec: {
    id: '154728e7-d715-47d9-aabd-8b97903a7362',
    name: '',
    targeting: {
      age_min: 18,
      age_max: 65,
      locales: [],
      exclusions: {
        interests: [
          {
            id: '1',
            name: '',
            audience_size_lower_bound: 0,
            audience_size_upper_bound: 0,
            path: ['test'],
            description: 'double location = flexible_spec.interests[0]',
            topic: 'test',
          },
          {
            id: '2',
            name: '',
            audience_size_lower_bound: 0,
            audience_size_upper_bound: 0,
            path: ['test'],
            description: 'double location = exclusion.interests[2]',
            topic: 'test',
          },
        ],
      },
      flexible_spec: [
        {
          interests: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double location = exclusion.interests[1]',
              topic: 'test',
            },
          ],
        },
        {
          interests: [
            {
              id: '2',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double location = exclusion.interests[1]',
              topic: 'test',
            },
          ],
        },
      ],
      geo_locations: {
        countries: [],
        location_types: [],
        cities: [],
        neighborhoods: [],
        places: [],
        regions: [],
      },
      targeting_optimization: 'none',
    },
  },
  userTags: [],
  topics: [],
  rank: 100,
};

export const mockDeduplicateIncludes: SearchResult = {
  id: '38fe6309-9085-5711-8bf7-a80f7cf38877',
  createdByContributors: false,
  spec: {
    id: '154728e7-d715-47d9-aabd-8b97903a7362',
    name: '',
    targeting: {
      age_min: 18,
      age_max: 65,
      locales: [],
      exclusions: {},
      flexible_spec: [
        {
          interests: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double locations = [flexible_spec[2]interests[0], flexible_spec[2]interests[1]]',
              topic: 'test',
            },
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
            {
              id: '2',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'test',
              topic: 'test',
            },
          ],
          work_employers: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
            {
              id: '3',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'test',
              topic: 'test',
            },
          ],
        },
        {
          interests: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
          work_employers: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
            {
              id: '4',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'test',
              topic: 'test',
            },
          ],
          work_positions: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
        },
        {
          interests: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
          work_employers: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
          education_statuses: [1, 2, 3],
          work_positions: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
        },
      ],
      geo_locations: {
        countries: [],
        location_types: [],
        cities: [],
        neighborhoods: [],
        places: [],
        regions: [],
      },
      targeting_optimization: 'none',
    },
  },
  userTags: [],
  topics: [],
  rank: 100,
};

export const mockDeduplicateAll: SearchResult = {
  id: '38fe6309-9085-5711-8bf7-a80f7cf38877',
  createdByContributors: false,
  spec: {
    id: '154728e7-d715-47d9-aabd-8b97903a7362',
    name: '',
    targeting: {
      age_min: 18,
      age_max: 65,
      locales: [],
      exclusions: {
        interests: [
          {
            id: '1',
            name: '',
            audience_size_lower_bound: 0,
            audience_size_upper_bound: 0,
            path: ['test'],
            description: 'double location = flexible_spec.interests[0]',
            topic: 'test',
          },
          {
            id: '2',
            name: '',
            audience_size_lower_bound: 0,
            audience_size_upper_bound: 0,
            path: ['test'],
            description: 'double location = exclusion.interests[2]',
            topic: 'test',
          },
        ],
      },
      flexible_spec: [
        {
          interests: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double locations = [flexible_spec[2]interests[0], flexible_spec[2]interests[1]]',
              topic: 'test',
            },
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
            {
              id: '2',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'test',
              topic: 'test',
            },
          ],
          work_employers: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
            {
              id: '3',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'test',
              topic: 'test',
            },
          ],
        },
        {
          interests: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
          work_employers: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
            {
              id: '4',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'test',
              topic: 'test',
            },
          ],
          work_positions: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
        },
        {
          interests: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
          work_employers: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
          education_statuses: [1, 2, 3],
          work_positions: [
            {
              id: '1',
              name: '',
              audience_size_lower_bound: 0,
              audience_size_upper_bound: 0,
              path: ['test'],
              description: 'double to be removed',
              topic: 'test',
            },
          ],
        },
      ],
      geo_locations: {
        countries: [],
        location_types: [],
        cities: [],
        neighborhoods: [],
        places: [],
        regions: [],
      },
      targeting_optimization: 'none',
    },
  },
  userTags: [],
  topics: [],
  rank: 100,
};
