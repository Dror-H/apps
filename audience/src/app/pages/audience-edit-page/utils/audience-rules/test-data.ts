import { AudienceDto, SupportedProviders, TargetingDto } from '@instigo-app/data-transfer-object';

export const mockRegularTargeting: TargetingDto = {
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
};

export const mockRegularTargetingWithLocation: TargetingDto = {
  provider: SupportedProviders.FACEBOOK,
  include: {
    and: [
      { or: { ageRange: [{ providerId: '(25,50)', type: 'ageRange' }] } },
      { or: { locales: [{ providerId: [] }] } },
      { or: { locationTypes: [], countries: [] } },
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
};
