import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { getAdAccountStatusDescription } from '@api/ad-account/services/ad-account-status-description';
import { ExchangeRateService } from '@api/exchange-rate/exchange-rate.service';
import { ResourceInsightsService } from '@api/insights/services/resource-insights.service';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { CacheTtlSeconds, Resources, TimeIncrement, TimeRange } from '@instigo-app/data-transfer-object';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { Cache } from 'cache-manager';
import { plainToClass } from 'class-transformer';
import { differenceInCalendarDays, format, parseJSON } from 'date-fns';
import { groupBy, orderBy, sumBy } from 'lodash';
import { getRepository } from 'typeorm';

@Injectable()
export class WorkspaceDashboardService {
  logger = new Logger(WorkspaceDashboardService.name);

  @Inject(ResourceInsightsService)
  private readonly resourceInsightsService: ResourceInsightsService;

  @Inject(ExchangeRateService)
  private readonly exchangeRateService: ExchangeRateService;

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  async dashboard(options: { workspaceId: string; timeRange: TimeRange }) {
    const { workspaceId, timeRange } = options;
    try {
      const workspace = await this.workspaceQuery({ id: workspaceId });
      workspace.owner = plainToClass(User, workspace.owner);
      workspace['adAccounts'] = [...(await this.getAdAccountsDetails({ workspace, timeRange }))] as any;

      const { insights, stats } = await this.analytics({ workspace });
      return { ...workspace, insights, stats };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getAdAccountsDetails({ workspace, timeRange }) {
    const adAccounts = await this.getAdAccountsInsights({
      workspace,
      timeRange,
    });
    return adAccounts.map((adAccount) => ({
      ...adAccount,
      adAccountStatusDescription: getAdAccountStatusDescription(adAccount),
    }));
  }

  async analytics(options: { workspace: Workspace }) {
    const { workspace } = options;
    const rates = await this.exchangeRateService.exchangeRates({ currency: workspace?.settings?.defaultCurrency });
    const summaryInsights = this.workspaceInsights({ workspace, rates, isVersus: false });
    const versusInsights = this.workspaceInsights({ workspace, rates, isVersus: true });
    const providerSummaryInsights = this.providerInsights({ workspace, rates, isVersus: false });
    const providerVersusInsights = this.providerInsights({ workspace, rates, isVersus: true });
    const dailyInsights = this.dailyBreakdownInsights({ workspace });
    const insights = {
      summary: summaryInsights,
      versusSummary: versusInsights,
      data: dailyInsights,
      byProvider: { summary: providerSummaryInsights, versus: providerVersusInsights },
    };
    const stats = this.buildStats({ workspace });
    return { insights, stats } || {};
  }

  workspaceQuery(options: { id: string }): Promise<Workspace> {
    return (
      getRepository(Workspace)
        .createQueryBuilder('workspace')
        .select()
        .where('workspace.id = :id', { id: options.id })
        //
        .leftJoinAndSelect('workspace.owner', 'owner')
        .addSelect('owner.id')
        .addSelect('owner.firstName')
        .addSelect('owner.lastName')
        .addSelect('owner.email')
        .leftJoinAndSelect('owner.oAuthTokens', 'oAuthTokens')
        .addSelect('oAuthTokens.provider')
        .addSelect('oAuthTokens.status')
        .addSelect('oAuthTokens.accessToken')
        //
        .leftJoin('workspace.members', 'members')
        .addSelect('members.id')
        .addSelect('members.firstName')
        .addSelect('members.lastName')
        .addSelect('members.email')
        .addSelect('members.createdAt')
        .addOrderBy('members.createdAt', 'DESC')
        //
        .leftJoin('workspace.adAccounts', 'adAccounts')
        .addSelect('adAccounts.id')
        .addSelect('adAccounts.name')
        .addSelect('adAccounts.provider')
        .addSelect('adAccounts.currency')
        .addSelect('adAccounts.providerId')
        .addSelect('adAccounts.businessId')
        .addSelect('adAccounts.businessName')
        .addSelect('adAccounts.status')
        .addSelect('adAccounts.disableReason')
        .addSelect('adAccounts.totalAmountSpent')
        .addSelect('adAccounts.businessProfilePicture')
        .addSelect('adAccounts.updatedAt')
        .addSelect('adAccounts.createdAt')
        .loadRelationCountAndMap('adAccounts.totalCampaigns', 'adAccounts.campaigns')
        .loadRelationCountAndMap('adAccounts.activeCampaigns', 'adAccounts.campaigns', 'campaign', (qb) =>
          qb.andWhere('campaign.status = :status', { status: 'ACTIVE' }),
        )
        .addOrderBy('adAccounts.createdAt', 'DESC')
        //
        .leftJoin('workspace.inPendingMembers', 'inPendingMembers')
        .addSelect('inPendingMembers.id')
        .addSelect('inPendingMembers.firstName')
        .addSelect('inPendingMembers.lastName')
        .addSelect('inPendingMembers.email')
        .addSelect('inPendingMembers.createdAt')
        .addOrderBy('inPendingMembers.createdAt', 'DESC')
        .getOne()
    );
  }

  buildStats(options: { workspace: Workspace }) {
    return {
      adAccountsProviderBreakdown: Object.entries(groupBy(options.workspace.adAccounts, 'provider')).reduce(
        (acc, current) => {
          const [provider, entries] = current;
          return { ...acc, [provider]: entries.length };
        },
        {},
      ),
    };
  }

  providerInsights({ workspace, rates, isVersus }) {
    const groupedByProvider = Object.entries(groupBy(workspace.adAccounts, 'provider'));
    const breakdown = groupedByProvider.reduce((acc, current) => {
      const [provider, adaccounts] = current;
      const insights = this.workspaceInsights({
        workspace: adaccounts,
        rates,
        isVersus: isVersus,
        isProviderBreakdown: true,
      });
      return { ...acc, [provider]: insights };
    }, {});
    return breakdown;
  }

  workspaceInsights({ workspace, rates, isVersus, isProviderBreakdown = false }) {
    const whichData = isVersus ? 'versusSummary' : 'summary';
    const whichObject = isProviderBreakdown ? workspace : workspace.adAccounts;
    const insights =
      {
        spend:
          sumBy(whichObject, (account: any) =>
            this.exchangeRateService.exchangeAmount({
              amount: account?.insights?.[whichData]?.spend || 0,
              from: account.currency,
              rates,
            }),
          ) || 0,
        impressions: sumBy(whichObject, (account: any) => account?.insights?.[whichData]?.impressions) || 0,
        reach: sumBy(whichObject, (account: any) => account?.insights?.[whichData]?.reach) || 0,
        clicks: sumBy(whichObject, (account: any) => account?.insights?.[whichData]?.clicks) || 0,
        uniqueClicks: sumBy(whichObject, (account: any) => account?.insights?.[whichData]?.uniqueClicks) || 0,
        socialSpend: sumBy(whichObject, (account: any) => account?.insights?.[whichData]?.socialSpend) || 0,
      } || {};
    const math = this.computeMetrics(insights);
    return { ...insights, ...math } || {};
  }

  computeMetrics(insights) {
    return {
      cpm: Number(((insights?.spend * 1000) / insights?.impressions).toFixed(4)) || 0,
      cpc: Number((Number(insights?.spend) / insights?.clicks).toFixed(4)) || 0,
      ctr: Number(((insights?.clicks / insights?.impressions) * 100).toFixed(4)) || 0,
      frequency: Number((insights?.impressions / insights?.reach).toFixed(4)) || 0,
    };
  }

  dailyBreakdownInsights({ workspace }) {
    try {
      const allDataPoints = [];
      workspace.adAccounts?.map((adAccount) => {
        adAccount.insights?.data?.map((item) => {
          allDataPoints.push({ ...item, date: format(parseJSON(item.date), 'yyyy/MM/dd') });
        });
      });

      return orderBy(
        Object.entries(groupBy(allDataPoints, 'date')).map((entry, key) => {
          const insights = {
            date: entry[0],
            spend: sumBy(entry[1], (data: any) => data?.spend) || 0,
            impressions: sumBy(entry[1], (data: any) => data.impressions) || 0,
            reach: sumBy(entry[1], (data: any) => data.reach) || 0,
            clicks: sumBy(entry[1], (data: any) => data.clicks) || 0,
            uniqueClicks: sumBy(entry[1], (data: any) => data.uniqueClicks) || 0,
            socialSpend: sumBy(entry[1], (data: any) => data.socialSpend) || 0,
          };
          const math = this.computeMetrics(insights);
          return { ...insights, ...math };
        }),
        'date',
        'asc',
      );
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getAdAccountsInsights(options: { workspace: Partial<Workspace>; timeRange: TimeRange }): Promise<AdAccount[]> {
    const { workspace, timeRange } = options;
    const cacheKey = `workspace-dashboard-${workspace.id}-${JSON.stringify({
      since: format(new Date(timeRange.start), 'yyyy-MM-dd'),
      until: format(new Date(timeRange.end), 'yyyy-MM-dd'),
    })}`;
    const cachedInsights = await this.cacheManager.get<AdAccount[]>(cacheKey);
    if (cachedInsights) {
      return cachedInsights;
    }
    const daysCount = Math.abs(differenceInCalendarDays(new Date(timeRange.start), new Date(timeRange.end)));
    const timeIncrement = daysCount > 120 ? TimeIncrement.MONTHLY : TimeIncrement.DAILY;
    const adAccounts = workspace.adAccounts;
    try {
      const insights: AdAccount[] = [];
      for (const [provider, entries] of Object.entries(groupBy(adAccounts, 'provider'))) {
        const [err, entriesInsights] = await to(
          this.resourceInsightsService
            .fetchInsights({
              workspace,
              entries,
              provider,
              type: Resources.AD_ACCOUNTS,
              timeRange,
              timeIncrement: timeIncrement,
              providerParameters: { versus: true },
            })
            .toPromise(),
        );
        if (!err) {
          insights.push(...entriesInsights);
        }
      }
      await this.cacheManager.set(cacheKey, insights, { ttl: CacheTtlSeconds.FIVE_MINUTES });
      return insights;
    } catch (e) {
      this.logger.error(e);
      return adAccounts;
    }
  }
}
