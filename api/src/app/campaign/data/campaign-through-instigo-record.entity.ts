import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity({ name: 'campaign_through_instigo_records' })
export class CampaignThroughInstigoRecord {
  @PrimaryColumn({ nullable: false, unique: true, type: 'bigint' })
  provider_id: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column({ nullable: false, unique: false, type: 'bigint' })
  ad_account_id: string;

  @Column({ nullable: false, unique: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: false, unique: false, type: 'uuid' })
  workspace_id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt?: Date;

  @VersionColumn({ default: 0 })
  version: number;
}
