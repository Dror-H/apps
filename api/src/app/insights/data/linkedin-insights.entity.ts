import { LinkedinBreakdownType } from '@instigo-app/data-transfer-object';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
export class LinkedinMetricEntity {
  @Column({ type: 'float', nullable: true, default: 0 })
  spend: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  impressions: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  reach: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  clicks: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  frequency: number;

  @Column({ name: 'conversions', type: 'float', nullable: true, default: 0 })
  conversions: number;

  @Column({ name: 'conversions_rate', type: 'float', nullable: true, default: 0 })
  conversionsRate: number;

  @Column({ name: 'total_engagements', type: 'float', nullable: true, default: 0 })
  totalEngagements: number;

  @Column({ name: 'other_engagements', type: 'float', nullable: true, default: 0 })
  otherEngagements: number;

  @Column({ name: 'likes', type: 'float', nullable: true, default: 0 })
  likes: number;

  @Column({ name: 'comments', type: 'float', nullable: true, default: 0 })
  comments: number;

  @Column({ name: 'shares', type: 'float', nullable: true, default: 0 })
  shares: number;

  @Column({ name: 'follows', type: 'float', nullable: true, default: 0 })
  follows: number;
}
@Entity({ name: 'linkedin_insights' })
@Index(
  'linkedin_insights_index',
  [
    'adAccountId',
    'campaignId',
    'adId',
    'breakdown',
    'date',
    'country',
    'region',
    'industry',
    'seniority',
    'jobTitle',
    'jobFunction',
    'company',
    'companySize',
  ],
  { unique: true },
)
export class LinkedinInsightsEntity {
  @PrimaryColumn()
  id: string;

  @Index('linkedin_ad_account_id_insights_index', { unique: false })
  @Column({ name: 'ad_account_id', type: 'bigint' })
  adAccountId: number;

  @Index('linkedin_campaign_id_insights_index', { unique: false })
  @Column({ name: 'campaign_id', nullable: true, type: 'bigint' })
  campaignId: number;

  @Index('linkedin_ad_id_insights_index', { unique: false })
  @Column({ name: 'ad_id', nullable: true, type: 'bigint' })
  adId: number;

  @Index('linkedin_date_insights_index', { unique: false })
  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: LinkedinBreakdownType, nullable: false })
  breakdown: LinkedinBreakdownType;

  @Column(() => LinkedinMetricEntity, { prefix: false })
  metric: LinkedinMetricEntity;

  @Column({ default: null, nullable: true })
  country: string;

  @Column({ default: null, nullable: true })
  region: string;

  @Column({ default: null, nullable: true })
  industry: string;

  @Column({ default: null, nullable: true })
  seniority: string;

  @Column({ name: 'job_title', default: null, nullable: true })
  jobTitle: string;

  @Column({ name: 'job_function', default: null, nullable: true })
  jobFunction: string;

  @Column({ default: null, nullable: true })
  company: string;

  @Column({ name: 'company_size', default: null, nullable: true })
  companySize: string;
}
