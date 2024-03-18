import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { NotificationSupportedProviders, NotificationType, Resources } from '@instigo-app/data-transfer-object';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { User } from '@api/user/data/user.entity';
import { AdAccount } from '@api/ad-account/data/ad-account.entity';

@Index('notifications_index', ['providerId', 'read', 'user', 'workspace'], { unique: true })
@Entity({ name: Resources.NOTIFICATIONS })
export class Notification extends IngoBaseEntity {
  @Column({ name: 'provider_id', nullable: true, unique: false })
  providerId: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  banner: boolean;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationSupportedProviders })
  provider: NotificationSupportedProviders;

  @Column({ name: 'provider_metadata', type: 'jsonb', nullable: true, default: null })
  providerMetadata: any;

  @Column({ name: 'extra_data', type: 'jsonb', nullable: true, default: null })
  extraData: any;

  @ManyToOne(() => User, (user) => user.id, { nullable: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => AdAccount, (adAccount) => adAccount.id, { nullable: true, onDelete: 'CASCADE' })
  adAccount: AdAccount;

  @ManyToOne(() => Workspace, (workspace) => workspace.id, { nullable: true, onDelete: 'CASCADE' })
  workspace: Workspace;
}
