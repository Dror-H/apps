import { Page } from '@api/ad-account/data/page.entity';
import { Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: Resources.LEADGEN_FORM })
export class LeadgenForm {
  @PrimaryColumn({ name: 'provider_id' })
  providerId: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'leads_count', nullable: true })
  leadsCount: number;

  @Column({ name: 'expired_leads_count', nullable: true })
  expiredLeadsCount: number;

  @ManyToOne(() => Page, (page) => page.providerId, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

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
