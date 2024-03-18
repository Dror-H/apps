import { ResourceInsightsService } from '../../insights/services/resource-insights.service';
import { MockRates, workspaceDashboardMockResult, workspaceMock } from '../../workspace/services/test.mock';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';
import { WorkspaceDashboardService } from './workspace-dashboard.service';

describe('WorkspaceDashboardService', () => {
  const emptyInsights = {
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
  };
  let service: WorkspaceDashboardService;
  let resourceInsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceDashboardService,
        { provide: ResourceInsightsService, useValue: {} },
        {
          provide: 'ExchangeRateService',
          useValue: {
            exchangeAmount: () => 0,
            exchangeRates: () => [],
          },
        },
        { provide: CACHE_MANAGER, useValue: { get: () => null, set: (k, v) => 'OK' } },
      ],
    }).compile();

    service = module.get<WorkspaceDashboardService>(WorkspaceDashboardService);
    resourceInsightsService = module.get<ResourceInsightsService>(ResourceInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('3party should fail and we should return empty adAccounts', async () => {
    resourceInsightsService.fetchInsights = jest.fn().mockImplementationOnce(() => throwError('Horror'));
    const adAccounts = await service.getAdAccountsInsights({
      workspace: workspaceMock,
      timeRange: { start: new Date('2021-04-30T21:00:00.000Z'), end: new Date('2021-05-05T20:59:59.999Z') },
    });
    expect(adAccounts).toEqual(workspaceMock.adAccounts);
  });

  it('should return  defined insights 1', () => {
    const insights = service.workspaceInsights({
      workspace: undefined,
      rates: undefined,
      isVersus: true,
      isProviderBreakdown: true,
    });
    expect(insights).toEqual(emptyInsights);
  });

  it('should return  defined insights 2', () => {
    const insights = service.workspaceInsights({
      workspace: workspaceMock,
      rates: MockRates,
      isVersus: true,
      isProviderBreakdown: true,
    });
    expect(insights).toEqual(emptyInsights);
  });

  it('should return  defined insights 3', () => {
    const insights = service.workspaceInsights({
      workspace: workspaceMock,
      rates: MockRates,
      isVersus: false,
      isProviderBreakdown: true,
    });
    expect(insights).toEqual(emptyInsights);
  });

  it('should return  defined insights 4', () => {
    const insights = service.workspaceInsights({
      workspace: workspaceMock,
      rates: MockRates,
      isVersus: true,
      isProviderBreakdown: false,
    });
    expect(insights).toEqual(emptyInsights);
  });

  it('3party should crash', async () => {
    service.workspaceQuery = jest.fn().mockResolvedValueOnce(workspaceMock);
    resourceInsightsService.fetchInsights = jest.fn().mockImplementationOnce(() => throwError('Horror'));

    const workspaceDashboard = await service.dashboard({
      workspaceId: '',
      timeRange: { start: new Date('2021-04-30T21:00:00.000Z'), end: new Date('2021-05-05T20:59:59.999Z') },
    });
    expect(workspaceDashboard).toEqual(workspaceDashboardMockResult);
  });
});
