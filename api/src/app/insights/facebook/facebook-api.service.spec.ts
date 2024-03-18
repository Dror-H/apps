import { mockAdAccount } from '@instigo-app/api-shared';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { of } from 'rxjs';
import { FacebookApiService } from './facebook-api.service';
describe('FacebookApiService', () => {
  let service: FacebookApiService;
  let httpService: any;
  const accessToken = faker.datatype.uuid() as string;
  const adAccount = mockAdAccount({ provider: 'facebook' })[0];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        FacebookApiService,
        {
          provide: 'HttpService',
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<FacebookApiService>(FacebookApiService);
    httpService = module.get<any>('HttpService');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get waiting time 1', () => {
    const waiting = (service as any).getWaitingTime({}, 'act_312312');
    expect(waiting).toBeDefined();
    expect(waiting).toEqual(1);
  });

  it('should get waiting time 2', () => {
    const waiting = (service as any).getWaitingTime(
      {
        response: {
          headers: {},
        },
      },
      'act_312312',
    );
    expect(waiting).toBeDefined();
    expect(waiting).toEqual(1);
  });

  it('should get waiting time 3', () => {
    const waiting = (service as any).getWaitingTime(
      {
        response: {
          headers: {
            ['x-business-use-case-usage']: JSON.stringify({
              312312: [
                {
                  ['estimated_time_to_regain_access']: 5,
                },
              ],
            }),
          },
        },
      },
      'act_312312',
    );
    expect(waiting).toBeDefined();
    expect(waiting).toEqual(5);
  });

  it('should get one entry insights', async () => {
    const args = {
      accessToken,
      accountId: adAccount.providerId,
      providerId: '3243142432',
      timeRange: {
        start: new Date('2021-06-01'),
        end: new Date('2021-07-31'),
      },
    };
    httpService.post = jest.fn().mockReturnValue(
      of({
        data: {
          '3243142432': {
            data: [
              {
                spend: '1.47',
                date_start: '2021-06-18',
                date_stop: '2021-06-18',
              },
            ],
          },
        },
      }),
    );
    const insights = await service.getInsights(args);
    expect(insights).toHaveLength(1);
  });

  it('should get multiple entries insights', async () => {
    const args = {
      accessToken,
      accountId: adAccount.providerId,
      providerId: '3243142432',
      timeRange: {
        start: new Date('2021-06-01'),
        end: new Date('2021-07-31'),
      },
    };
    const next = faker.internet.url();
    httpService.post = jest.fn().mockReturnValue(
      of({
        data: {
          '3243142432': {
            data: [
              {
                spend: '1.47',
                date_start: '2021-06-18',
                date_stop: '2021-06-18',
              },
            ],
            paging: {
              cursors: {
                before: 'MAZDZD',
                after: 'MAZDZD',
              },
              next,
            },
          },
        },
      }),
    );
    httpService.get = jest.fn().mockReturnValue(
      of({
        data: {
          data: [
            {
              spend: '1.43',
              date_start: '2021-06-19',
              date_stop: '2021-06-19',
            },
          ],
        },
      }),
    );
    const insights = await service.getInsights(args);
    expect(insights).toHaveLength(2);
  });

  it('should handle errors', async () => {
    const args = {
      accessToken,
      accountId: adAccount.providerId,
      providerId: '3243142432',
      timeRange: {
        start: new Date('2021-06-01'),
        end: new Date('2021-07-31'),
      },
    };
    (service as any).waitFor = jest.fn().mockReturnValue(1);
    (service as any).getWaitingTime = jest.fn().mockReturnValue(1);
    service.getInsights = jest.fn().mockReturnValue([]);

    await (service as any).handleError(new Error('error'), args);

    expect((service as any).getWaitingTime).toHaveBeenCalledTimes(1);
    expect((service as any).getInsights).toHaveBeenCalledTimes(1);
  });
});
