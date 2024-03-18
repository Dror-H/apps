import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdSet } from '@api/ad-set/data/ad-set.entity';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import {
  AdTemplateDataType,
  CampaignStatusType,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { LinkedinAdType } from '@instigo-app/third-party-connector/linkedin';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity({ name: Resources.ADS })
export class Ad extends IngoBaseEntity {
  @Index(`${Resources.ADS}_provider_id_idx`)
  @Column({ unique: true })
  providerId: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  status: CampaignStatusType;

  @Column({ type: 'varchar', nullable: true })
  effectiveStatus: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', nullable: true })
  linkedinType: LinkedinAdType;

  @Column({ nullable: true })
  objectStoryId: string;

  @Column({ nullable: true })
  instagramPermalink: string;

  @Column({ type: 'varchar', nullable: true })
  actionTypeField: string;

  @ManyToOne(() => AdSet, (adSet) => adSet.id, { nullable: true, onDelete: 'CASCADE' })
  adSet: AdSet;

  @ManyToOne(() => Campaign, (campaign) => campaign.id, { onDelete: 'CASCADE' })
  campaign: Campaign;

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { onDelete: 'CASCADE' })
  adAccount: AdAccount;

  @Column({ type: 'jsonb', nullable: true })
  objectStorySpec: AdTemplateDataType;
}
