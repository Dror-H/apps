import { AudienceType, Resources, SupportedProviders, TargetingDto } from '@instigo-app/data-transfer-object';
import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: Resources.TARGETING_TEMPLATES })
export class TargetingTemplate extends IngoBaseEntity {
  @Column({ nullable: true, unique: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  provider: SupportedProviders;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, unique: false })
  size: number;

  @Column({ type: 'varchar', nullable: true, default: AudienceType.SAVED_AUDIENCE })
  type: AudienceType;

  @Column({ type: 'jsonb', default: {}, nullable: true })
  rules: TargetingDto;

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { onDelete: 'CASCADE' })
  adAccount: AdAccount;
}
