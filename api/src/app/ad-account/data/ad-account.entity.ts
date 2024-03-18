import { IngoBaseEntity } from '@instigo-app/api-shared';
import { MinDailyBudget, Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Campaign } from '../../campaign/data/campaign.entity';
import { Workspace } from '../../workspace/data/workspace.entity';
import { Page } from './page.entity';

@Entity({ name: Resources.AD_ACCOUNTS })
export class AdAccount extends IngoBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: false })
  provider: SupportedProviders;

  @Index(`${Resources.AD_ACCOUNTS}_provider_id_idx`)
  @Column({ nullable: false, unique: true })
  providerId: string;

  @Column({ nullable: true })
  status: string;

  @Column({ name: 'disable-reason', nullable: true })
  disableReason: string;

  @Column({ name: 'total-amount-spent', nullable: true })
  totalAmountSpent: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  businessId: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessProfilePicture: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  providerMetadata: any;

  @Column({ nullable: true })
  businessCity: string;

  @Column({ nullable: true })
  businessStreet: string;

  @Column({ nullable: true })
  businessStreet2: string;

  @Column({ nullable: true })
  businessZip: string;

  @Column({ nullable: true })
  businessCountryCode: string;

  @Column({ nullable: true })
  timezoneId: string;

  @Column({ nullable: true })
  timezoneName: string;

  @Column({ nullable: true })
  timezoneOffsetHoursUtc: string;

  @Column({ nullable: true, type: 'jsonb', default: null })
  minDailyBudget?: MinDailyBudget;

  @ManyToOne(() => Workspace, (workspace) => workspace.adAccounts, { onDelete: 'CASCADE' })
  @JoinColumn()
  workspace: Workspace;

  @OneToMany(() => Campaign, (campaign) => campaign.adAccount)
  campaigns: Campaign;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastSynced?: Date;

  @ManyToMany(() => Page, (page) => page.adAccounts, { cascade: true, eager: true, onDelete: 'CASCADE' })
  pages?: Page[];
}
