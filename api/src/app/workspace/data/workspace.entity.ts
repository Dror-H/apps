import { Resources, WorkspaceSettings } from '@instigo-app/data-transfer-object';
import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { User } from '@api/user/data/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: Resources.WORKSPACES })
export class Workspace extends IngoBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: false })
  disabled: boolean;

  @ManyToMany(() => User, (user) => user.assignedWorkspaces, { cascade: true, eager: true })
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedWorkspace, { eager: true })
  owner: User;

  @OneToMany(() => AdAccount, (adAccount) => adAccount.workspace, { eager: true })
  adAccounts: AdAccount[];

  @Column({ type: 'jsonb', default: {}, nullable: true })
  settings: WorkspaceSettings;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastSynced?: Date;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  inPendingMembers: User[];
}
