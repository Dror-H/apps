import { OauthTokensAccesstoken } from '@api/auth/data/oauth-tokens-accesstoken.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { IngoBaseEntity } from '@instigo-app/api-shared';
import { BillingsDetails, Resources, Roles, UserSettings } from '@instigo-app/data-transfer-object';
import to from 'await-to-js';
import * as bcrypt from 'bcryptjs';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { isEmpty } from 'lodash';
import { AfterLoad, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: Resources.USERS })
export class User extends IngoBaseEntity {
  @Column({ length: 150, unique: false, nullable: true })
  @MaxLength(150)
  username: string = undefined;

  @Column({ name: 'first_name', length: 30, nullable: true })
  @MaxLength(30)
  @IsOptional()
  firstName: string = undefined;

  @Column({ name: 'last_name', length: 30, nullable: true })
  @MaxLength(30)
  @IsOptional()
  lastName: string = undefined;

  @Column({ length: 254, unique: true })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  email: string = undefined;

  @Column({ length: 24, unique: true, nullable: true, default: null })
  @IsOptional({ always: true })
  @MaxLength(24)
  phone: string = undefined;

  @Column({ name: 'is_active', default: true })
  isActive: boolean = undefined;

  @Column({ length: 128, select: true })
  @MaxLength(128)
  password: string = undefined;

  @Column({ name: 'email_verification', type: 'boolean', default: false })
  emailVerification: boolean;

  @Column({ type: 'simple-json', default: false, nullable: true })
  onboarding: {
    completed: boolean;
  };

  @Column({ type: 'simple-array', default: Roles.USER, nullable: true })
  roles: Roles[];

  @Column({ type: 'jsonb', default: {}, nullable: true })
  settings: UserSettings;

  @OneToMany(() => Workspace, (workspace) => workspace.owner)
  @JoinColumn()
  ownedWorkspace: Workspace[];

  @ManyToMany(() => Workspace, (workspace) => workspace.members)
  @JoinTable()
  assignedWorkspaces: Workspace[];

  @OneToMany(() => OauthTokensAccesstoken, (oAuthToken) => oAuthToken.user)
  @JoinTable()
  oAuthTokens: OauthTokensAccesstoken[];

  @Index({ unique: true })
  @Column({ type: 'varchar', name: 'stripe_customer_id', nullable: true })
  stripeCustomerId?: string;

  @Column({ type: 'varchar', name: 'stripe_subscription_id', nullable: true })
  stripeSubscriptionId?: string;

  @Column({ type: 'boolean', name: 'subscription_status', default: false })
  subscriptionStatus: boolean;

  @Column({ type: 'varchar', nullable: true })
  pictureUrl?: string;

  @Column({ type: 'simple-json', default: null, nullable: true })
  billing: BillingsDetails;

  fullName: string;
  intercomIdentifierSHA?: string;

  async setPassword(password: string) {
    if (password) {
      this.password = await bcrypt.hash(password, 10);
    }
    return this;
  }

  getAccessToken({ provider }) {
    return this.oAuthTokens.find((token) => token.provider === provider && token.scope === 'authorizeApp');
  }

  @AfterLoad()
  async assignFullNameAndPicture() {
    this.fullName = !(isEmpty(this.firstName) && isEmpty(this.lastName))
      ? `${this.firstName} ${this.lastName}`
      : this.email;
    if (!this.pictureUrl) {
      this.pictureUrl = `https://eu.ui-avatars.com/api/?name=${this.fullName}`;
    }
    if (this.pictureUrl) {
      const [err, result] = await to(fetch(this.pictureUrl));
      if (result?.status !== 200) {
        this.pictureUrl = `https://eu.ui-avatars.com/api/?name=${this.fullName}`;
      }
      if (err) {
        this.pictureUrl = `https://eu.ui-avatars.com/api/?name=${this.fullName}`;
      }
    }
  }
}
