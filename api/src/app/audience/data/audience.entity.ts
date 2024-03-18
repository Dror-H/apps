import {
  AudienceAvailability,
  AudienceLookalikeDto,
  AudienceMetadata,
  AudienceRulesDto,
  AudienceSubType,
  AudienceType,
  Resources,
  SupportedProviders,
  TargetingDto,
} from '@instigo-app/data-transfer-object';
import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: Resources.AUDIENCES })
export class Audience extends IngoBaseEntity {
  @Column({ unique: true })
  providerId: string;

  @Column({ type: 'varchar', nullable: false })
  provider: SupportedProviders;

  @Column({ nullable: true, unique: false })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, unique: false })
  size: number;

  @Column({ type: 'varchar', nullable: true })
  type: AudienceType;

  @Column({ type: 'varchar', nullable: true })
  subType: AudienceSubType;

  @Column({ type: 'varchar', nullable: true })
  availability: AudienceAvailability;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  rules?: AudienceRulesDto | TargetingDto;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  lookalikeSpec?: AudienceLookalikeDto;

  @ManyToMany((type) => Audience, (audience) => audience.lookalikeSpec.originAudience, {
    nullable: true,
    cascade: false,
  })
  @JoinTable()
  lookalikeAudiences?: Audience[];

  @Column({ nullable: true })
  sharing: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  metadata: AudienceMetadata;

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { onDelete: 'CASCADE' })
  adAccount: AdAccount;
}
