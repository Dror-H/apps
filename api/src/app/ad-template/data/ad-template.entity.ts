import { AdTemplateDataType, AdTemplateType, Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: Resources.AD_TEMPLATES })
export class AdTemplate extends IngoBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: AdTemplateType })
  adTemplateType: AdTemplateType;

  @Column({ type: 'jsonb', default: {}, nullable: true })
  data: AdTemplateDataType;

  @Column({ type: 'varchar', nullable: false })
  provider: SupportedProviders;

  @ManyToOne(() => AdAccount, { onDelete: 'CASCADE' })
  adAccount: AdAccount;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}
