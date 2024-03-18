/* eslint-disable max-lines */

import { Workspace } from '../data/workspace.entity';

export const workspaceMock = {
  id: 'dd14220c-3fd7-448e-894f-fd192d7eb781',
  createdAt: '2021-04-29T13:43:24.481Z',
  updatedAt: '2021-05-04T22:37:45.518Z',
  version: 9,
  name: 'my workspace test',
  description: 'my workspace',
  disabled: false,
  settings: {
    defaultCurrency: 'EUR',
  },
  lastSynced: '2021-05-05T00:25:29.721Z',
  owner: {
    id: 'ca458436-908a-4219-b360-9c0c6d9e687f',
    username: 'lupu',
    firstName: 'Bogdan',
    lastName: 'lupu',
    email: 'lupu60@gmail.com',
    phone: null,
    isActive: true,
    password: '$2a$10$c7qo5U4ceyw/1zlKuTbox.Ibv5D5fzNaR16zFYKAiuNBIKKXv7zjG',
    createdAt: '2021-04-29T13:42:13.642Z',
    updatedAt: '2021-05-05T12:23:52.891Z',
    version: 13,
    emailVerification: false,
    onboarding: {
      completed: true,
    },
    roles: ['USER'],
    settings: {
      defaultWorkspace: 'dd14220c-3fd7-448e-894f-fd192d7eb781',
    },
    stripeCustomerId: null,
    pictureUrl:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3278437282186540&height=50&width=50&ext=1622295733&hash=AeRpiUWQzitlHOsRAlU',
    billing: {},
    oAuthTokens: [
      {
        id: '95fa25e8-16e0-466f-97fa-e3451ed2d8bf',
        provider: 'facebook',
        providerClientId: '3278437282186540',
        grantedAt: '+053312-08-24T14:00:20.000Z',
        accessToken:
          'EAAGb0nwx5ZAcBAOnGC1Q39PVlmRsgKwvv4TtSXpQ0BPuLjELk9m3x1HLLdzG1gxA3pkVeo9CvM6xOxRKD6CGR2jZBLVeWDzX5ZCWyrPiyO3x5jsHsHV4oGLUqSU7HAo1qootZBRzBg5wnMee0oZCpEBuvXKeuwj5bOZAqzyAGjlCAaVZAw3hzOT3WVIZCgvajXkZD',
        expiresAt: '+053476-12-02T14:00:20.000Z',
        refreshTokenExpiresAt: null,
        tokenType: null,
        scope: 'authorizeApp',
        status: 'ACTIVE',
        createdAt: '2021-04-29T13:42:13.686Z',
        updatedAt: '2021-05-05T12:23:53.190Z',
        version: 4,
      },
      {
        id: '9897f3b1-1a7f-43be-926f-79ad75f4b402',
        provider: 'google',
        providerClientId: '107920904189046094575',
        grantedAt: '+053306-07-18T12:48:44.000Z',
        accessToken:
          'ya29.a0AfH6SMB7NsMqy9mzSQo4tBCD7lgUYoG56prWNKZJlZ_v3r0OdXMDnPTQGFzcK8Lue4xXXc98-Jtp5qErbyzKxeNQctEvojZlWSiQMEDLJOavL7Rbmxv_v4KEJigZRaZVIyHStCEYv1otKuGLGA9-7uwdkv6Z',
        expiresAt: '+053470-10-26T12:48:44.000Z',
        refreshTokenExpiresAt: null,
        tokenType: null,
        scope: 'login',
        status: null,
        createdAt: '2021-05-03T06:54:03.001Z',
        updatedAt: '2021-05-05T00:28:03.591Z',
        version: 3,
      },
      {
        id: '7b10bf5f-017d-47b3-bf42-d7e126f5857c',
        provider: 'linkedin',
        providerClientId: 'KO5-Si88Hm',
        grantedAt: '+053296-05-14T16:15:30.000Z',
        accessToken:
          'AQVXOhlwjh7Z1nWHHG0aT0m5olEs1_bLijwdiWpP4-TYwNGCV7abcsiKd06fn0BIgWuUyiFbhI2XR5IGgLW87y4ziIpGD6r5CP5A27IDC-RdmPMgXV0IaymehbSguOCZAvwYfGacgUBqPxJ6Ri8Ke5hQwNz8yku560873AFvpoXd7mCB1QVtPXPo4mQZqXVqolCR-o6tX4TYjg9ux1CDqaZ5AWfCDA6BCtrflyoE7pXpJM2XuPkfqeh3JT4QIrDro7xUr6NVYcApjKMulcvSELPcQH-zj5t_6tr3jJtCM2m2RGL0Scg1kt7nDa1b85gDIWsboiXZAN3fSIBsst2O4QWpFE-4JQ',
        expiresAt: '+053460-08-23T16:15:30.000Z',
        refreshToken:
          'AQU5nEsizjoVG7ugvCNCQaSvgPKgfKGvLXWFxL0lWfXDxVN5f2bFCziUnppKK2G-SevKtcaNy9ZxbdzVhZfv-3mmFQpuJHV9a8hGcn1hk5qVpMWeJcKm5HB0VYg1Aemrb_ADY1SQB8mmW1EjTHWafPvkJdbphHrZKIXjBROeiMbiXV02vs5bbFKfFFSImBmZlJDq9Q5gP7tb3DSRmyOIOGJ4HjHuqWo9c3ofAy6SysIpVJC0yedEasPhoidoiUFzBPqBbVfA-3coe-zFyMLrQ9VTt-ZXTvpVD0n5fOqLwEOkvFBU8U9FAS7vmE1CDgYHZS-0VrmrOq6cNh8fFZDjH7xuQIBxjg',
        refreshTokenExpiresAt: null,
        tokenType: null,
        scope: 'authorizeApp',
        status: 'ACTIVE',
        createdAt: '2021-04-29T13:43:13.109Z',
        updatedAt: '2021-04-29T13:43:13.109Z',
        version: 1,
      },
    ],
    fullName: 'Bogdan lupu',
  },
  members: [
    {
      id: 'ca458436-908a-4219-b360-9c0c6d9e687f',
      firstName: 'Bogdan',
      lastName: 'lupu',
      email: 'lupu60@gmail.com',
      createdAt: '2021-04-29T13:42:13.642Z',
      fullName: 'Bogdan lupu',
    },
  ],
  adAccounts: [
    {
      id: '166ac989-cad9-4f4c-8814-0f6959d49f7a',
      createdAt: '2021-04-29T13:43:24.481Z',
      updatedAt: '2021-05-01T19:46:53.249Z',
      name: 'Bogdan Ad Account',
      provider: 'linkedin',
      providerId: '503621586',
      currency: 'USD',
      status: 'ACTIVE',
      disableReason: 'NONE',
      businessName: 'Bogdan Ad Account',
      businessProfilePicture: '',
      totalCampaigns: 0,
      activeCampaigns: 0,
    },
    {
      id: 'b4a3b03c-5d1e-4776-b42f-41b16769e8dd',
      createdAt: '2021-04-29T13:43:24.481Z',
      updatedAt: '2021-04-29T13:43:24.481Z',
      name: 'Trester’s Ad Account',
      provider: 'linkedin',
      providerId: '506864689',
      currency: 'EUR',
      businessName: 'Trester’s Ad Account',
      businessProfilePicture: '',
      totalCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      activeCampaigns: 0,
    },
    {
      id: '302a9611-1712-47d3-a6f7-346adbfbb11e',
      createdAt: '2021-04-29T13:43:24.481Z',
      updatedAt: '2021-05-01T19:46:53.449Z',
      name: "Insticore's Ad Account",
      provider: 'linkedin',
      providerId: '506319907',
      currency: 'EUR',
      businessName: 'Insticore ',
      status: 'ACTIVE',
      disableReason: 'NONE',
      businessProfilePicture:
        'https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1628121600&v=beta&t=F0w8Bvwu3Rck35w4ijYzuNvJnF4vDX_G-8sOZJhtW3M',
      totalCampaigns: 39,
      activeCampaigns: 0,
    },
    {
      id: 'de884de0-3c04-49c5-8b99-9370273cd567',
      createdAt: '2021-04-29T13:43:24.481Z',
      updatedAt: '2021-04-29T13:43:24.481Z',
      name: 'LBS Ad Account',
      provider: 'linkedin',
      providerId: '507023458',
      currency: 'EUR',
      status: 'ACTIVE',
      disableReason: 'NONE',
      businessName: 'Lauder Business School',
      businessProfilePicture:
        'https://media-exp1.licdn.com/dms/image/C4E0BAQE3zXKJ0BTDsQ/company-logo_200_200/0/1519881977623?e=1628121600&v=beta&t=ydXHc0_kQNsJNnKgyr1ZZYfy2ks908YzlGdOYPfjEBk',
      totalCampaigns: 22,
      activeCampaigns: 0,
    },
    {
      id: '94abe2e0-45d8-4bdc-8299-48e70a5445ef',
      createdAt: '2020-08-07T09:23:36.000Z',
      updatedAt: '2021-05-05T13:00:07.260Z',
      name: 'Instizone',
      provider: 'facebook',
      providerId: 'act_1390312014489081',
      currency: 'EUR',
      businessName: 'Instizone',
      status: 'ACTIVE',
      disableReason: 'NONE',
      businessProfilePicture:
        'https://scontent.ftsr1-1.fna.fbcdn.net/v/t31.18172-1/p100x100/14195321_1001469875264_8424695334849083916_o.png?_nc_cat=102&ccb=1-3&_nc_sid=872a9a&_nc_ohc=GlpE-GtVEi4AX8zVs6h&_nc_ht=scontent.ftsr1-1.fna&tp=30&oh=07f48dc78b2bf8d4eb769b7219e1cc96&oe=60B9EC76',
      totalCampaigns: 13,
      activeCampaigns: 0,
    },
    {
      id: 'c70c1147-cc6b-4890-a8dd-eaeeec2685cf',
      createdAt: '2020-03-30T10:57:48.000Z',
      updatedAt: '2021-05-05T13:00:07.705Z',
      name: 'demo',
      provider: 'facebook',
      providerId: 'act_197096074923022',
      currency: 'USD',
      businessName: 'Instigo Office Test',
      status: 'ACTIVE',
      disableReason: 'NONE',
      businessProfilePicture:
        'https://scontent.ftsr1-1.fna.fbcdn.net/v/t31.18172-1/p100x100/14232033_1001469875174_8753672282576746301_o.png?_nc_cat=101&ccb=1-3&_nc_sid=872a9a&_nc_ohc=lDCDCJUlyx8AX9-XGSr&_nc_ht=scontent.ftsr1-1.fna&tp=30&oh=fe95dbc154d951f631124d585eba2d39&oe=60B85595',
      totalCampaigns: 5,
      activeCampaigns: 0,
    },
    {
      id: '7417e75b-6a37-40dd-a8dc-60ec9ecea0f5',
      createdAt: '2020-01-15T14:40:41.000Z',
      updatedAt: '2021-05-05T13:00:06.560Z',
      name: 'Insticore 2020',
      provider: 'facebook',
      status: 'ACTIVE',
      disableReason: 'NONE',
      providerId: 'act_586338851914346',
      currency: 'EUR',
      businessName: 'Insticore',
      businessProfilePicture:
        'https://scontent.ftsr1-2.fna.fbcdn.net/v/t1.6435-0/p100x100/52602369_247140049557878_4302450816951779328_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=eb6dd6&_nc_ohc=62hXoo3bh1QAX8NVGVe&_nc_ht=scontent.ftsr1-2.fna&tp=6&oh=3f9d5a2418bf1cc16fb2f000c20bb9a4&oe=60B91038',
      totalCampaigns: 4,
      activeCampaigns: 0,
    },
    {
      id: '3d0e971f-de02-4207-9254-74495eac0467',
      createdAt: '2018-08-12T11:12:29.000Z',
      updatedAt: '2021-05-05T13:00:05.400Z',
      name: 'Insticore',
      provider: 'facebook',
      providerId: 'act_2075778135788234',
      status: 'ACTIVE',
      disableReason: 'NONE',
      currency: 'EUR',
      businessName: 'Insticore',
      businessProfilePicture:
        'https://scontent.ftsr1-2.fna.fbcdn.net/v/t1.6435-0/p100x100/52602369_247140049557878_4302450816951779328_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=eb6dd6&_nc_ohc=62hXoo3bh1QAX8NVGVe&_nc_ht=scontent.ftsr1-2.fna&tp=6&oh=3f9d5a2418bf1cc16fb2f000c20bb9a4&oe=60B91038',
      totalCampaigns: 33,
      activeCampaigns: 3,
    },
    {
      id: 'e0ab7a03-0703-4b94-8f12-5124ca1d4a38',
      createdAt: '2009-01-11T23:53:02.000Z',
      updatedAt: '2021-05-05T13:00:09.945Z',
      name: 'Lauder Business School',
      provider: 'facebook',
      providerId: 'act_37793603',
      currency: 'EUR',
      businessName: 'Lauder Business School',
      status: 'ACTIVE',
      disableReason: 'NONE',
      businessProfilePicture:
        'https://scontent.ftsr1-2.fna.fbcdn.net/v/t1.18169-1/p100x100/483845_390905817673739_1941766058_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=dbb9e7&_nc_ohc=DoGP5NLFceEAX96svAB&_nc_ht=scontent.ftsr1-2.fna&tp=6&oh=e13b9833e0ea624605cd4c3ceabf9ab1&oe=60B6D709',
      totalCampaigns: 94,
      activeCampaigns: 5,
    },
  ],
  inPendingMembers: [],
} as unknown as Workspace;

export const MockRates = {
  AED: 4.4313,
  AFN: 94.1693,
  ALL: 123.5324,
  AMD: 625.26,
  ANG: 2.1599,
  AOA: 781.2785,
  ARS: 112.6306,
  AUD: 1.5588,
  AWG: 2.1599,
  AZN: 2.0401,
  BAM: 1.9558,
  BBD: 2.4133,
  BDT: 101.6887,
  BGN: 1.9558,
  BHD: 0.4537,
  BIF: 2348.3842,
  BMD: 1.2066,
  BND: 1.6041,
  BOB: 8.2898,
  BRL: 6.544,
  BSD: 1.2066,
  BTN: 88.7577,
  BWP: 13.129,
  BYN: 3.0812,
  BZD: 2.4133,
  CAD: 1.4848,
  CDF: 2392.8232,
  CHF: 1.0985,
  CLP: 847.318,
  CNY: 7.7872,
  COP: 4534.6798,
  CRC: 738.6473,
  CUC: 1.2066,
  CUP: 31.0707,
  CVE: 110.265,
  CZK: 25.8831,
  DJF: 214.4434,
  DKK: 7.4604,
  DOP: 68.8684,
  DZD: 160.6632,
  EGP: 18.8065,
  ERN: 18.0994,
  ETB: 50.629,
  EUR: 1,
  FJD: 2.4402,
  FKP: 0.869,
  FOK: 7.4604,
  GBP: 0.8692,
  GEL: 4.1222,
  GGP: 0.869,
  GHS: 6.9228,
  GIP: 0.869,
  GMD: 62.6067,
  GNF: 11932.8781,
  GTQ: 9.2913,
  GYD: 259.4009,
  HKD: 9.3453,
  HNL: 28.8707,
  HRK: 7.5345,
  HTG: 104.2874,
  HUF: 361.1673,
  IDR: 17329.8992,
  ILS: 3.9314,
  IMP: 0.869,
  INR: 88.7583,
  IQD: 1757.1289,
  IRR: 50158.5091,
  ISK: 149.7696,
  JMD: 185.0062,
  JOD: 0.8555,
  JPY: 131.4463,
  KES: 128.898,
  KGS: 101.8339,
  KHR: 4914.2928,
  KID: 1.5588,
  KMF: 491.9678,
  KRW: 1351.2589,
  KWD: 0.3615,
  KYD: 1.0055,
  KZT: 515.068,
  LAK: 11314.5009,
  LBP: 1818.9943,
  LKR: 236.4314,
  LRD: 206.496,
  LSL: 17.391,
  LYD: 5.3959,
  MAD: 10.7351,
  MDL: 21.299,
  MGA: 4563.1947,
  MKD: 61.6124,
  MMK: 1867.9669,
  MNT: 3433.7283,
  MOP: 9.6254,
  MRU: 43.4026,
  MUR: 48.3384,
  MVR: 18.4852,
  MWK: 954.104,
  MXN: 24.3337,
  MYR: 4.9465,
  MZN: 69.1508,
  NAD: 17.391,
  NGN: 474.9458,
  NIO: 41.9846,
  NOK: 10.0061,
  NPR: 142.0123,
  NZD: 1.6817,
  OMR: 0.4639,
  PAB: 1.2066,
  PEN: 4.595,
  PGK: 4.2103,
  PHP: 57.7474,
  PKR: 183.605,
  PLN: 4.5588,
  PYG: 7827.0335,
  QAR: 4.3921,
  RON: 4.9221,
  RSD: 117.5734,
  RUB: 90.1471,
  RWF: 1185.6395,
  SAR: 4.5249,
  SBD: 9.4886,
  SCR: 17.9636,
  SDG: 457.0292,
  SEK: 10.181,
  SGD: 1.6041,
  SHP: 0.869,
  SLL: 12318.8472,
  SOS: 696.7971,
  SRD: 17.047,
  SSP: 213.7546,
  STN: 24.5,
  SYP: 1516.8298,
  SZL: 17.391,
  THB: 37.4955,
  TJS: 13.5749,
  TMT: 4.2015,
  TND: 3.2921,
  TOP: 2.7174,
  TRY: 9.9917,
  TTD: 8.4171,
  TVD: 1.5588,
  TWD: 33.589,
  TZS: 2787.3903,
  UAH: 33.3576,
  UGX: 4287.334,
  USD: 1.207,
  UYU: 52.7643,
  UZS: 12760.4082,
  VES: 3410368.83,
  VND: 27605.0823,
  VUV: 129.7812,
  WST: 3.0148,
  XAF: 655.957,
  XCD: 3.2579,
  XDR: 0.8387,
  XOF: 655.957,
  XPF: 119.332,
  YER: 300.7007,
  ZAR: 17.3911,
  ZMW: 26.7974,
};

export const workspaceDashboardMockResult = {
  adAccounts: [
    {
      activeCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Bogdan Ad Account',
      businessProfilePicture: '',
      createdAt: '2021-04-29T13:43:24.481Z',
      currency: 'USD',
      id: '166ac989-cad9-4f4c-8814-0f6959d49f7a',
      name: 'Bogdan Ad Account',
      provider: 'linkedin',
      providerId: '503621586',
      totalCampaigns: 0,
      updatedAt: '2021-05-01T19:46:53.249Z',
    },
    {
      activeCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Trester’s Ad Account',
      businessProfilePicture: '',
      createdAt: '2021-04-29T13:43:24.481Z',
      currency: 'EUR',
      id: 'b4a3b03c-5d1e-4776-b42f-41b16769e8dd',
      name: 'Trester’s Ad Account',
      provider: 'linkedin',
      providerId: '506864689',
      totalCampaigns: 0,
      updatedAt: '2021-04-29T13:43:24.481Z',
    },
    {
      activeCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Insticore ',
      businessProfilePicture:
        'https://media-exp1.licdn.com/dms/image/C4E0BAQEGdvwt79PwkA/company-logo_200_200/0/1573658772269?e=1628121600&v=beta&t=F0w8Bvwu3Rck35w4ijYzuNvJnF4vDX_G-8sOZJhtW3M',
      createdAt: '2021-04-29T13:43:24.481Z',
      currency: 'EUR',
      id: '302a9611-1712-47d3-a6f7-346adbfbb11e',
      name: "Insticore's Ad Account",
      provider: 'linkedin',
      providerId: '506319907',
      totalCampaigns: 39,
      updatedAt: '2021-05-01T19:46:53.449Z',
    },
    {
      activeCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Lauder Business School',
      businessProfilePicture:
        'https://media-exp1.licdn.com/dms/image/C4E0BAQE3zXKJ0BTDsQ/company-logo_200_200/0/1519881977623?e=1628121600&v=beta&t=ydXHc0_kQNsJNnKgyr1ZZYfy2ks908YzlGdOYPfjEBk',
      createdAt: '2021-04-29T13:43:24.481Z',
      currency: 'EUR',
      id: 'de884de0-3c04-49c5-8b99-9370273cd567',
      name: 'LBS Ad Account',
      provider: 'linkedin',
      providerId: '507023458',
      totalCampaigns: 22,
      updatedAt: '2021-04-29T13:43:24.481Z',
    },
    {
      activeCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Instizone',
      businessProfilePicture:
        'https://scontent.ftsr1-1.fna.fbcdn.net/v/t31.18172-1/p100x100/14195321_1001469875264_8424695334849083916_o.png?_nc_cat=102&ccb=1-3&_nc_sid=872a9a&_nc_ohc=GlpE-GtVEi4AX8zVs6h&_nc_ht=scontent.ftsr1-1.fna&tp=30&oh=07f48dc78b2bf8d4eb769b7219e1cc96&oe=60B9EC76',
      createdAt: '2020-08-07T09:23:36.000Z',
      currency: 'EUR',
      id: '94abe2e0-45d8-4bdc-8299-48e70a5445ef',
      name: 'Instizone',
      provider: 'facebook',
      providerId: 'act_1390312014489081',
      totalCampaigns: 13,
      updatedAt: '2021-05-05T13:00:07.260Z',
    },
    {
      activeCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Instigo Office Test',
      businessProfilePicture:
        'https://scontent.ftsr1-1.fna.fbcdn.net/v/t31.18172-1/p100x100/14232033_1001469875174_8753672282576746301_o.png?_nc_cat=101&ccb=1-3&_nc_sid=872a9a&_nc_ohc=lDCDCJUlyx8AX9-XGSr&_nc_ht=scontent.ftsr1-1.fna&tp=30&oh=fe95dbc154d951f631124d585eba2d39&oe=60B85595',
      createdAt: '2020-03-30T10:57:48.000Z',
      currency: 'USD',
      id: 'c70c1147-cc6b-4890-a8dd-eaeeec2685cf',
      name: 'demo',
      provider: 'facebook',
      providerId: 'act_197096074923022',
      totalCampaigns: 5,
      updatedAt: '2021-05-05T13:00:07.705Z',
    },
    {
      activeCampaigns: 0,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Insticore',
      businessProfilePicture:
        'https://scontent.ftsr1-2.fna.fbcdn.net/v/t1.6435-0/p100x100/52602369_247140049557878_4302450816951779328_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=eb6dd6&_nc_ohc=62hXoo3bh1QAX8NVGVe&_nc_ht=scontent.ftsr1-2.fna&tp=6&oh=3f9d5a2418bf1cc16fb2f000c20bb9a4&oe=60B91038',
      createdAt: '2020-01-15T14:40:41.000Z',
      currency: 'EUR',
      id: '7417e75b-6a37-40dd-a8dc-60ec9ecea0f5',
      name: 'Insticore 2020',
      provider: 'facebook',
      providerId: 'act_586338851914346',
      totalCampaigns: 4,
      updatedAt: '2021-05-05T13:00:06.560Z',
    },
    {
      activeCampaigns: 3,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Insticore',
      businessProfilePicture:
        'https://scontent.ftsr1-2.fna.fbcdn.net/v/t1.6435-0/p100x100/52602369_247140049557878_4302450816951779328_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=eb6dd6&_nc_ohc=62hXoo3bh1QAX8NVGVe&_nc_ht=scontent.ftsr1-2.fna&tp=6&oh=3f9d5a2418bf1cc16fb2f000c20bb9a4&oe=60B91038',
      createdAt: '2018-08-12T11:12:29.000Z',
      currency: 'EUR',
      id: '3d0e971f-de02-4207-9254-74495eac0467',
      name: 'Insticore',
      provider: 'facebook',
      providerId: 'act_2075778135788234',
      totalCampaigns: 33,
      updatedAt: '2021-05-05T13:00:05.400Z',
    },
    {
      activeCampaigns: 5,
      status: 'ACTIVE',
      disableReason: 'NONE',
      adAccountStatusDescription: null,
      businessName: 'Lauder Business School',
      businessProfilePicture:
        'https://scontent.ftsr1-2.fna.fbcdn.net/v/t1.18169-1/p100x100/483845_390905817673739_1941766058_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=dbb9e7&_nc_ohc=DoGP5NLFceEAX96svAB&_nc_ht=scontent.ftsr1-2.fna&tp=6&oh=e13b9833e0ea624605cd4c3ceabf9ab1&oe=60B6D709',
      createdAt: '2009-01-11T23:53:02.000Z',
      currency: 'EUR',
      id: 'e0ab7a03-0703-4b94-8f12-5124ca1d4a38',
      name: 'Lauder Business School',
      provider: 'facebook',
      providerId: 'act_37793603',
      totalCampaigns: 94,
      updatedAt: '2021-05-05T13:00:09.945Z',
    },
  ],
  createdAt: '2021-04-29T13:43:24.481Z',
  description: 'my workspace',
  disabled: false,
  id: 'dd14220c-3fd7-448e-894f-fd192d7eb781',
  inPendingMembers: [],
  insights: {
    byProvider: {
      summary: {
        facebook: {
          clicks: 0,
          cpc: 0,
          cpm: 0,
          ctr: 0,
          frequency: 0,
          impressions: 0,
          reach: 0,
          socialSpend: 0,
          spend: 0,
          uniqueClicks: 0,
        },
        linkedin: {
          clicks: 0,
          cpc: 0,
          cpm: 0,
          ctr: 0,
          frequency: 0,
          impressions: 0,
          reach: 0,
          socialSpend: 0,
          spend: 0,
          uniqueClicks: 0,
        },
      },
      versus: {
        facebook: {
          clicks: 0,
          cpc: 0,
          cpm: 0,
          ctr: 0,
          frequency: 0,
          impressions: 0,
          reach: 0,
          socialSpend: 0,
          spend: 0,
          uniqueClicks: 0,
        },
        linkedin: {
          clicks: 0,
          cpc: 0,
          cpm: 0,
          ctr: 0,
          frequency: 0,
          impressions: 0,
          reach: 0,
          socialSpend: 0,
          spend: 0,
          uniqueClicks: 0,
        },
      },
    },
    data: [],
    summary: {
      clicks: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      frequency: 0,
      impressions: 0,
      reach: 0,
      socialSpend: 0,
      spend: 0,
      uniqueClicks: 0,
    },
    versusSummary: {
      clicks: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      frequency: 0,
      impressions: 0,
      reach: 0,
      socialSpend: 0,
      spend: 0,
      uniqueClicks: 0,
    },
  },
  lastSynced: '2021-05-05T00:25:29.721Z',
  members: [
    {
      createdAt: '2021-04-29T13:42:13.642Z',
      email: 'lupu60@gmail.com',
      firstName: 'Bogdan',
      fullName: 'Bogdan lupu',
      id: 'ca458436-908a-4219-b360-9c0c6d9e687f',
      lastName: 'lupu',
    },
  ],
  name: 'my workspace test',
  owner: {
    billing: {},
    createdAt: '2021-04-29T13:42:13.642Z',
    email: 'lupu60@gmail.com',
    emailVerification: false,
    firstName: 'Bogdan',
    fullName: 'Bogdan lupu',
    id: 'ca458436-908a-4219-b360-9c0c6d9e687f',
    isActive: true,
    lastName: 'lupu',
    oAuthTokens: [
      {
        accessToken:
          'EAAGb0nwx5ZAcBAOnGC1Q39PVlmRsgKwvv4TtSXpQ0BPuLjELk9m3x1HLLdzG1gxA3pkVeo9CvM6xOxRKD6CGR2jZBLVeWDzX5ZCWyrPiyO3x5jsHsHV4oGLUqSU7HAo1qootZBRzBg5wnMee0oZCpEBuvXKeuwj5bOZAqzyAGjlCAaVZAw3hzOT3WVIZCgvajXkZD',
        createdAt: '2021-04-29T13:42:13.686Z',
        expiresAt: '+053476-12-02T14:00:20.000Z',
        grantedAt: '+053312-08-24T14:00:20.000Z',
        id: '95fa25e8-16e0-466f-97fa-e3451ed2d8bf',
        provider: 'facebook',
        providerClientId: '3278437282186540',
        refreshTokenExpiresAt: null,
        scope: 'authorizeApp',
        status: 'ACTIVE',
        tokenType: null,
        updatedAt: '2021-05-05T12:23:53.190Z',
        version: 4,
      },
      {
        accessToken:
          'ya29.a0AfH6SMB7NsMqy9mzSQo4tBCD7lgUYoG56prWNKZJlZ_v3r0OdXMDnPTQGFzcK8Lue4xXXc98-Jtp5qErbyzKxeNQctEvojZlWSiQMEDLJOavL7Rbmxv_v4KEJigZRaZVIyHStCEYv1otKuGLGA9-7uwdkv6Z',
        createdAt: '2021-05-03T06:54:03.001Z',
        expiresAt: '+053470-10-26T12:48:44.000Z',
        grantedAt: '+053306-07-18T12:48:44.000Z',
        id: '9897f3b1-1a7f-43be-926f-79ad75f4b402',
        provider: 'google',
        providerClientId: '107920904189046094575',
        refreshTokenExpiresAt: null,
        scope: 'login',
        status: null,
        tokenType: null,
        updatedAt: '2021-05-05T00:28:03.591Z',
        version: 3,
      },
      {
        accessToken:
          'AQVXOhlwjh7Z1nWHHG0aT0m5olEs1_bLijwdiWpP4-TYwNGCV7abcsiKd06fn0BIgWuUyiFbhI2XR5IGgLW87y4ziIpGD6r5CP5A27IDC-RdmPMgXV0IaymehbSguOCZAvwYfGacgUBqPxJ6Ri8Ke5hQwNz8yku560873AFvpoXd7mCB1QVtPXPo4mQZqXVqolCR-o6tX4TYjg9ux1CDqaZ5AWfCDA6BCtrflyoE7pXpJM2XuPkfqeh3JT4QIrDro7xUr6NVYcApjKMulcvSELPcQH-zj5t_6tr3jJtCM2m2RGL0Scg1kt7nDa1b85gDIWsboiXZAN3fSIBsst2O4QWpFE-4JQ',
        createdAt: '2021-04-29T13:43:13.109Z',
        expiresAt: '+053460-08-23T16:15:30.000Z',
        grantedAt: '+053296-05-14T16:15:30.000Z',
        id: '7b10bf5f-017d-47b3-bf42-d7e126f5857c',
        provider: 'linkedin',
        providerClientId: 'KO5-Si88Hm',
        refreshToken:
          'AQU5nEsizjoVG7ugvCNCQaSvgPKgfKGvLXWFxL0lWfXDxVN5f2bFCziUnppKK2G-SevKtcaNy9ZxbdzVhZfv-3mmFQpuJHV9a8hGcn1hk5qVpMWeJcKm5HB0VYg1Aemrb_ADY1SQB8mmW1EjTHWafPvkJdbphHrZKIXjBROeiMbiXV02vs5bbFKfFFSImBmZlJDq9Q5gP7tb3DSRmyOIOGJ4HjHuqWo9c3ofAy6SysIpVJC0yedEasPhoidoiUFzBPqBbVfA-3coe-zFyMLrQ9VTt-ZXTvpVD0n5fOqLwEOkvFBU8U9FAS7vmE1CDgYHZS-0VrmrOq6cNh8fFZDjH7xuQIBxjg',
        refreshTokenExpiresAt: null,
        scope: 'authorizeApp',
        status: 'ACTIVE',
        tokenType: null,
        updatedAt: '2021-04-29T13:43:13.109Z',
        version: 1,
      },
    ],
    onboarding: {
      completed: true,
    },
    password: '$2a$10$c7qo5U4ceyw/1zlKuTbox.Ibv5D5fzNaR16zFYKAiuNBIKKXv7zjG',
    phone: null,
    pictureUrl:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3278437282186540&height=50&width=50&ext=1622295733&hash=AeRpiUWQzitlHOsRAlU',
    roles: ['USER'],
    settings: {
      defaultWorkspace: 'dd14220c-3fd7-448e-894f-fd192d7eb781',
    },
    stripeCustomerId: null,
    updatedAt: '2021-05-05T12:23:52.891Z',
    username: 'lupu',
    version: 13,
  },
  settings: {
    defaultCurrency: 'EUR',
  },
  stats: {
    adAccountsProviderBreakdown: {
      facebook: 5,
      linkedin: 4,
    },
  },
  updatedAt: '2021-05-04T22:37:45.518Z',
  version: 9,
};