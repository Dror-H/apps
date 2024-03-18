import { Page } from '@api/ad-account/data/page.entity';
import { Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity({ name: Resources.POSTS })
export class Post {
  @PrimaryColumn({ name: 'provider_id' })
  providerId: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  message: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  data: any;

  @ManyToOne(() => Page, (page) => page.providerId, { onDelete: 'CASCADE' })
  page: Page;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt?: Date;

  @VersionColumn({ default: 0 })
  version: number;
}
