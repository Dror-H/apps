import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';

@Injectable()
export class InsightsUtilService {
  roundSum = (...field) => `ROUND( SUM( COALESCE(${field},0) )::int , 2)`;
  round = (...field) => `ROUND( COALESCE(${field}, 0) ::int , 2)`;

  whereTime({ timeRange }) {
    return `AND date BETWEEN CAST('${format(new Date(timeRange.start), 'yyyy-MM-dd')}' AS DATE) AND CAST('${format(
      new Date(timeRange.end),
      'yyyy-MM-dd',
    )}' AS DATE)`;
  }

  jsonObject(object, as?, cast?) {
    return `json_build_object(${Object.entries(object)
      .map(([key, value]) => `'${key}', ${value}`)
      .join(`,\n`)}) ${as ? `${cast ? cast : '::jsonb'} as ${as}` : `${cast ? cast : '::jsonb'}`}`;
  }

  jsonToSelection(object) {
    return Object.entries(object)
      .map(([key, value]) => `${value} as ${key}`)
      .join(', ');
  }

  facebookRowMetrics() {
    const spend = this.round(`facebook_insights.spend`);
    const social_spend = this.round(`facebook_insights.social_spend`);
    const impressions = this.round(`facebook_insights.impressions`);
    const reach = this.round(`facebook_insights.reach`);
    const frequency = `ROUND( CAST(facebook_insights.frequency as numeric) , 2)`;
    const clicks = this.round(`facebook_insights.clicks`);
    const outbound_clicks = this.round(`facebook_insights.outbound_clicks`);
    const inline_link_clicks = this.round(`facebook_insights.inline_link_clicks`);
    const estimated_ad_recallers = this.round(`facebook_insights.estimated_ad_recallers`);
    const inline_post_engagement = this.round(`facebook_insights.inline_post_engagement`);

    return {
      // actions: `facebook_insights.actions`,
      spend: spend,
      social_spend: social_spend,
      impressions: impressions,
      reach: reach,
      frequency: frequency,
      clicks: clicks,
      outbound_clicks: outbound_clicks,
      inline_link_clicks: inline_link_clicks,
      inline_post_engagement: inline_post_engagement,
      outbound_clicks_ctr: `ROUND(CAST(${outbound_clicks}/NULLIF(${impressions},0) as NUMERIC), 2)`,
      cpp: `ROUND(CAST(${spend}/NULLIF(${reach},0) as NUMERIC), 2)`,
      inline_link_click_ctr: `ROUND(CAST(${inline_link_clicks}/NULLIF(${impressions},0) as NUMERIC), 2)`,
      cpm: `ROUND(CAST(((${spend}*1000)/NULLIF(${impressions},0)) as NUMERIC),2)`,
      cpc: `ROUND(CAST(${spend}/NULLIF(${clicks},0) as NUMERIC),2)`,
      ctr: `ROUND(CAST((${clicks}/NULLIF(${impressions},0))*100 as NUMERIC),2)`,
      cost_per_inline_link_click: `ROUND(CAST(${spend}/NULLIF(${inline_link_clicks},0) as NUMERIC), 2)`,
      cost_per_estimated_ad_recallers: `ROUND(CAST(${spend}/NULLIF(${estimated_ad_recallers},0) as NUMERIC), 2)`,
      cost_per_inline_post_engagement: `ROUND(CAST(${spend}/NULLIF(${inline_post_engagement},0) as NUMERIC), 2)`,
      unique_clicks: `ROUND(CAST(facebook_insights.unique_clicks as NUMERIC),2)`,
      cost_per_unique_click: `ROUND(CAST(facebook_insights.cost_per_unique_click as NUMERIC), 2)`,
    };
  }

  facebookSumMetrics() {
    const spend = this.roundSum(`facebook_insights.spend`);
    const social_spend = this.roundSum(`facebook_insights.social_spend`);
    const impressions = this.roundSum(`facebook_insights.impressions`);
    const reach = this.roundSum(`facebook_insights.reach`);
    const clicks = this.roundSum(`facebook_insights.clicks`);
    const outbound_clicks = this.roundSum(`facebook_insights.outbound_clicks`);
    const inline_link_clicks = this.roundSum(`facebook_insights.inline_link_clicks`);
    const estimated_ad_recallers = this.roundSum(`facebook_insights.estimated_ad_recallers`);
    const inline_post_engagement = this.roundSum(`facebook_insights.inline_post_engagement`);
    const frequency = `ROUND( CAST(AVG(facebook_insights.frequency) as numeric) , 2)`;

    return {
      // actions: `array_agg(facebook_insights.actions)`,
      spend: spend,
      social_spend: social_spend,
      impressions: impressions,
      reach: reach,
      frequency: frequency,
      clicks: clicks,
      outbound_clicks: outbound_clicks,
      inline_link_clicks: inline_link_clicks,
      inline_post_engagement: inline_post_engagement,
      outbound_clicks_ctr: `ROUND(CAST(${outbound_clicks}/NULLIF(${impressions},0) as NUMERIC), 2)`,
      cpp: `ROUND(CAST(${spend}/NULLIF(${reach},0) as NUMERIC), 2)`,
      inline_link_click_ctr: `ROUND(CAST(${inline_link_clicks}/NULLIF(${impressions},0) as NUMERIC), 2)`,
      cpm: `ROUND(CAST(((${spend}*1000)/NULLIF(${impressions},0)) as NUMERIC),2)`,
      cpc: `ROUND(CAST(${spend}/NULLIF(${clicks},0) as NUMERIC),2)`,
      ctr: `ROUND(CAST((${clicks}/NULLIF(${impressions},0))*100 as NUMERIC),2)`,
      cost_per_inline_link_click: `ROUND(CAST(${spend}/NULLIF(${inline_link_clicks},0) as NUMERIC), 2)`,
      cost_per_estimated_ad_recallers: `ROUND(CAST(${spend}/NULLIF(${estimated_ad_recallers},0) as NUMERIC), 2)`,
      cost_per_inline_post_engagement: `ROUND(CAST(${spend}/NULLIF(${inline_post_engagement},0) as NUMERIC), 2)`,
      unique_clicks: `ROUND(CAST(AVG(facebook_insights.unique_clicks) as NUMERIC),2)`,
      cost_per_unique_click: `ROUND(CAST(AVG(facebook_insights.cost_per_unique_click) as NUMERIC), 2)`,
    };
  }

  linkedinRowMetrics() {
    const spend = this.round(`linkedin_insights.spend`);
    const impressions = this.round(`linkedin_insights.impressions`);
    const reach = this.round(`linkedin_insights.reach`);
    const frequency = `ROUND( CAST(linkedin_insights.frequency as numeric) , 2)`;
    const clicks = this.round(`linkedin_insights.clicks`);
    const likes = this.round(`linkedin_insights.likes`);
    const comments = this.round(`linkedin_insights.comments`);
    const shares = this.round(`linkedin_insights.shares`);

    return {
      spend: spend,
      likes: likes,
      shares: shares,
      comments: comments,
      impressions: impressions,
      reach: reach,
      frequency: frequency,
      clicks: clicks,
      cpp: `ROUND(CAST(${spend}/NULLIF(${reach},0) as NUMERIC), 2)`,
      cpm: `ROUND(CAST(((${spend}*1000)/NULLIF(${impressions},0)) as NUMERIC),2)`,
      cpc: `ROUND(CAST(${spend}/NULLIF(${clicks},0) as NUMERIC),2)`,
      ctr: `ROUND(CAST((${clicks}/NULLIF(${impressions},0))*100 as NUMERIC),2)`,
    };
  }

  linkedinSumMetrics() {
    const spend = this.roundSum(`linkedin_insights.spend`);
    const impressions = this.roundSum(`linkedin_insights.impressions`);
    const reach = this.roundSum(`linkedin_insights.reach`);
    const clicks = this.roundSum(`linkedin_insights.clicks`);
    const likes = this.roundSum(`linkedin_insights.likes`);
    const comments = this.roundSum(`linkedin_insights.comments`);
    const shares = this.roundSum(`linkedin_insights.shares`);

    const frequency = `ROUND( CAST(AVG(linkedin_insights.frequency) as numeric) , 2)`;

    return {
      spend: spend,
      likes: likes,
      shares: shares,
      comments: comments,
      impressions: impressions,
      reach: reach,
      frequency: frequency,
      clicks: clicks,
      cpp: `ROUND(CAST(${spend}/NULLIF(${reach},0) as NUMERIC), 2)`,
      cpm: `ROUND(CAST(((${spend}*1000)/NULLIF(${impressions},0)) as NUMERIC),2)`,
      cpc: `ROUND(CAST(${spend}/NULLIF(${clicks},0) as NUMERIC),2)`,
      ctr: `ROUND(CAST((${clicks}/NULLIF(${impressions},0))*100 as NUMERIC),2)`,
    };
  }
}
