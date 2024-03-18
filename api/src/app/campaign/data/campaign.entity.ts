import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdSet } from '@api/ad-set/data/ad-set.entity';
import { Ad } from '@api/ad/data/ad.entity';
import { CampaignGroup } from '@api/campaign-group/data/campaign-group.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import {
  BidStrategy,
  BudgetType,
  CampaignStatusType,
  FacebookBidStrategyEnum,
  LinkedinBidStrategy,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import to from 'await-to-js';
import { AfterLoad, Column, CreateDateColumn, Entity, getRepository, Index, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: Resources.CAMPAIGNS })
export class Campaign extends IngoBaseEntity {
  @Index(`${Resources.CAMPAIGNS}_provider_id_idx`)
  @Column({ nullable: false, unique: true })
  providerId: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  status: CampaignStatusType;

  @Column({ type: 'varchar', nullable: true })
  effectiveStatus: string;

  @Column({ nullable: true, default: null })
  objective: string;

  @Column({ type: 'float', nullable: true, default: null })
  budget: number;

  @Column({ type: 'float', nullable: true, default: null })
  totalBudget: number;

  @Column({ type: 'varchar', nullable: true })
  budgetType: BudgetType;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  startTime: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  stopTime: Date;

  @Column({ type: 'varchar', nullable: true })
  bidStrategy: BidStrategy | LinkedinBidStrategy | FacebookBidStrategyEnum;

  @Column({ type: 'varchar', nullable: true })
  dayParting: string;

  @Column({ type: 'varchar', nullable: true })
  specialCats: any;

  @Column({ type: 'varchar', nullable: true })
  spendCap: number;

  @Column({ type: 'varchar', nullable: true })
  bidAmount: number;

  @Column({ type: 'float', nullable: true, default: null })
  budgetRemaining: number;

  @Column({ type: 'varchar', nullable: true })
  buyingType: string;

  @Column({ type: 'varchar', nullable: true })
  actionTypeField: string;

  @Column({ type: 'varchar', nullable: true })
  billingEvent: string;

  @Column({ type: 'varchar', nullable: true })
  linkedinType: string;

  @OneToMany(() => AdSet, (adset) => adset.campaign)
  adSets: AdSet[];

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { onDelete: 'CASCADE' })
  adAccount: AdAccount;

  @ManyToOne(() => CampaignGroup, (campaignGroup) => campaignGroup.providerId, { onDelete: 'CASCADE' })
  campaignGroup: CampaignGroup;

  @Column({ type: 'int', default: 0, nullable: true })
  adSetsCount?: number;

  @AfterLoad()
  async countAdSets() {
    const [, { count }] = await to(
      getRepository(AdSet)
        .createQueryBuilder(Resources.AD_SETS)
        .where('ad_sets.campaign = :id', { id: this.id })
        .select('COUNT(*)', 'count')
        .getRawOne(),
    );
    this.adSetsCount = count;
  }

  @AfterLoad()
  async setEffectiveStatus() {
    this.effectiveStatus = null;
    const [, effectiveStatuses] = await to(
      getRepository(Ad)
        .createQueryBuilder('ad')
        .where('ad.campaign = :id', { id: this.id })
        .select('ad.effectiveStatus')
        .getMany(),
    );
    if (effectiveStatuses.some((status) => status.effectiveStatus === 'PENDING_REVIEW')) {
      this.effectiveStatus = 'PENDING_REVIEW';
    }
    if (effectiveStatuses.some((status) => status.effectiveStatus === 'DISAPPROVED')) {
      this.effectiveStatus = 'DISAPPROVED';
    }
    if (effectiveStatuses.some((status) => status.effectiveStatus === 'PENDING_BILLING_INFO')) {
      this.effectiveStatus = 'PENDING_BILLING_INFO';
    }
    if (effectiveStatuses.some((status) => status.effectiveStatus === 'WITH_ISSUES')) {
      this.effectiveStatus = 'WITH_ISSUES';
    }
  }
}
