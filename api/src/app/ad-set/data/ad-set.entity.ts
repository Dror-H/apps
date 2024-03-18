import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { Ad } from '@api/ad/data/ad.entity';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import {
  AdSetSchedule,
  BudgetType,
  CampaignStatusType,
  FacebookBidStrategyEnum,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { Column, Entity, Index, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';

@Entity({ name: Resources.AD_SETS })
export class AdSet extends IngoBaseEntity {
  @Index(`${Resources.AD_SETS}_provider_id_idx`)
  @Column({ unique: true })
  providerId: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column()
  name: string;

  @Column({ type: 'float', nullable: true, default: null })
  budget: number;

  @Column({ type: 'varchar', nullable: true })
  budgetType: BudgetType;

  @Column({ type: 'varchar', nullable: true })
  status: CampaignStatusType;

  @Column({ type: 'varchar', nullable: true })
  bidStrategy: FacebookBidStrategyEnum;

  @Column({ type: 'varchar', nullable: true })
  optimizationGoal: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  promotedObject: any;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  startTime?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  endTime?: Date;

  @Column({ type: 'jsonb', nullable: true, default: null })
  adSetSchedule: AdSetSchedule;

  @Column({ type: 'float', nullable: true, default: null })
  budgetRemaining: number;

  @Column({ type: 'varchar', nullable: true })
  dayParting: string;

  @Column({ type: 'varchar', nullable: true })
  billingEvent: string;

  @Column({ type: 'varchar', nullable: true })
  actionTypeField: string;

  @OneToMany(() => Ad, (ad) => ad.adSet)
  ads: Ad[];

  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  campaign: Campaign;

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { onDelete: 'CASCADE' })
  adAccount: AdAccount;
}
