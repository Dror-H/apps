import { LeadgenForm } from '@api/leadgen-form/data/leadgen-form.entity';
import { PageType, Resources } from '@instigo-app/data-transfer-object';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { AdAccount } from './ad-account.entity';

@Entity({ name: Resources.PAGE })
export class Page {
  @PrimaryColumn({ name: 'provider_id' })
  providerId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  type: PageType;

  @Column({ nullable: true })
  picture: string;

  @Column({ name: 'fan_count', nullable: true })
  fanCount: string;

  @Column({ nullable: true })
  link: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  about?: string;

  @ManyToMany(() => AdAccount, (adAccount) => adAccount.pages, { cascade: false })
  @JoinTable()
  adAccounts: AdAccount[];

  @OneToMany(() => LeadgenForm, (leadgenForm) => leadgenForm.page)
  leadgenForms: LeadgenForm[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;

  @VersionColumn({ default: 0 })
  version: number;
}
