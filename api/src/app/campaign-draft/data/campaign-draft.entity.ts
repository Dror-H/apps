import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: Resources.CAMPAIGN_DRAFTS })
export class CampaignDraft extends IngoBaseEntity {
  @Column({ type: 'jsonb', default: {}, nullable: true })
  draft: any;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  provider: SupportedProviders;

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { onDelete: 'CASCADE' })
  adAccount: AdAccount;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.id)
  workspace: Workspace;
}
