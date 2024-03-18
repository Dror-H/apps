import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: Resources.CAMPAIGN_GROUP })
export class CampaignGroup {
  @PrimaryColumn({ name: 'provider_id' })
  providerId: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { onDelete: 'CASCADE' })
  adAccount: AdAccount;

  @OneToMany(() => Campaign, (campaign) => campaign.campaignGroup)
  campaigns: Campaign;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;

  @VersionColumn({ default: 0 })
  version: number;
}
