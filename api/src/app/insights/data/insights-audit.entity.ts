import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export enum StatusType {
  DONE = 'DONE',
  IN_PROGRESS = 'IN_PROGRESS',
  ERROR = 'ERROR',
}

@Entity({ name: 'insights_audit' })
export class InsightsAuditEntity {
  @PrimaryColumn({ name: 'ad_account_id' })
  adAccountId: string;

  @Column({ enum: SupportedProviders, nullable: false })
  provider: string;

  @Column({ enum: StatusType, nullable: true })
  status: StatusType;

  @Column({ name: 'start' })
  start: Date;

  @Column({ name: 'done' })
  done: Date;

  @Column({ default: 0 })
  progress?: number;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  details?: {
    index: number;
  };

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;

  @VersionColumn({ default: 0 })
  version?: number;
}
