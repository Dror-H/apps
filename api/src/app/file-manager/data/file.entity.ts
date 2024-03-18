import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: Resources.FILES })
export class File extends IngoBaseEntity {
  @Column()
  location: string;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  originalname: string;

  @Column()
  mimetype: string;

  @Column({ type: 'varchar', nullable: true })
  provider: SupportedProviders;

  @Column({ nullable: true, unique: true })
  providerId: string;

  @Column({ nullable: true })
  adAccountId: string;

  @Column({ type: 'jsonb', nullable: true })
  owner: User;

  @ManyToOne((type) => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}
