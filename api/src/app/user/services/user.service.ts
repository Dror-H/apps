import { AdTemplate } from '@api/ad-template/data/ad-template.entity';
import { passwordsAreEqual } from '@api/auth/services/passwordsAreEqual';
import { File } from '@api/file-manager/data/file.entity';
import { FileNestCrudService } from '@api/file-manager/services/file.nestcrud.service';
import { Notification } from '@api/notification/data/notification.entity';
import { Post } from '@api/post/data/post.entity';
import { SubscriptionService } from '@api/subscription/services/subscription.service';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { WorkspaceService } from '@api/workspace/services/workspace.service';
import { Resources, UserSettings } from '@instigo-app/data-transfer-object';
import { HttpException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { createHmac } from 'crypto';
import { isEmpty, isNil } from 'lodash';
import { Connection, EntityManager, getRepository } from 'typeorm';
import { UserDeviceMetadataEntity } from '../data/user-device-metadata.entity';
import { UserDeviceMetadataRepository } from '../data/user-device-metadata.repository';
import { User } from '../data/user.entity';
import { UserRepository } from '../data/user.repository';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(UserDeviceMetadataRepository)
  private readonly userDeviceMetadataRepository: UserDeviceMetadataRepository;

  @Inject(Connection)
  private readonly connection: Connection;

  @Inject(WorkspaceService)
  private readonly workspaceService: WorkspaceService;

  @Inject(FileNestCrudService)
  private readonly fileService: FileNestCrudService;

  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async getDetailedUser(options: { id: string }): Promise<User> {
    try {
      const { id } = options;
      const user = await this.detailedUser(id);
      user.intercomIdentifierSHA = this.getIntercomUserIdentifier({
        userId: user.id,
        key: this.configService.get('INTERCOM_IDENTITY_VERIFICATION_SECRET'),
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  async detailedUser(id: string) {
    const user = await this.connection
      .createQueryBuilder(User, 'user')
      .select()
      .where('user.id = :id', { id })
      .leftJoin('user.oAuthTokens', 'user.oAuthTokens')
      .addSelect([
        'user.oAuthTokens.id',
        'user.oAuthTokens.provider',
        'user.oAuthTokens.providerClientId',
        'user.oAuthTokens.scope',
        'user.oAuthTokens.createdAt',
        'user.oAuthTokens.updatedAt',
        'user.oAuthTokens.expiresAt',
        'user.oAuthTokens.grantedAt',
      ])
      .getOne();
    if (isNil(user)) {
      throw new NotFoundException();
    }
    const ownedWorkspaces = await this.connection
      .createQueryBuilder(Workspace, 'workspace')
      .where('workspace.ownerId = :id', { id })
      .andWhere('workspace.disabled = FALSE')
      .leftJoinAndSelect('workspace.adAccounts', 'adAccounts')
      .select()
      .getMany();

    const assignedWorkspaces = await this.connection
      .createQueryBuilder(Workspace, 'workspace')
      .select()
      .leftJoinAndSelect('workspace.adAccounts', 'adAccounts')
      .leftJoinAndSelect('adAccounts.pages', 'pages')
      .leftJoin('workspace.members', 'members')
      .addSelect('members.id')
      .addSelect('members.firstName')
      .addSelect('members.lastName')
      .addSelect('members.email')
      .addSelect('members.createdAt')
      .addOrderBy('members.createdAt', 'DESC')
      .leftJoin('workspace.owner', 'owner')
      .addSelect([
        'owner.id',
        'owner.email',
        'owner.firstName',
        'owner.lastName',
        'owner.createdAt',
        'owner.updatedAt',
        'owner.subscriptionStatus',
      ])
      .leftJoin('owner.oAuthTokens', 'ownerOAuthTokens')
      .addSelect([
        'ownerOAuthTokens.id',
        'ownerOAuthTokens.provider',
        'ownerOAuthTokens.providerClientId',
        'ownerOAuthTokens.scope',
        'ownerOAuthTokens.createdAt',
        'ownerOAuthTokens.updatedAt',
        'ownerOAuthTokens.expiresAt',
        'ownerOAuthTokens.grantedAt',
      ])
      .where('members.id = :id', { id })
      .andWhere('workspace.disabled = FALSE')
      .getMany();

    user['ownedWorkspace'] = ownedWorkspaces;
    user['assignedWorkspaces'] = assignedWorkspaces;
    delete user.password;
    return user;
  }

  async updateUser(options: { id: string; user: User }): Promise<any> {
    const { id } = options;
    const { user } = options;
    const existingUser = await this.userRepository.findOne({ id });
    const settings = this.updateSettings({ existingSettings: existingUser.settings, newSettings: user.settings });
    if (user.password) {
      user.password = (await plainToClass(User, user).setPassword(user.password)).password;
    }
    const userToUpdate = {
      ...user,
      id,
      settings,
    };

    await this.userRepository.save(userToUpdate);
    return this.getDetailedUser({ id });
  }

  updateSettings(options: { existingSettings: UserSettings; newSettings: UserSettings }) {
    const { existingSettings, newSettings } = options;
    const updatedSettings = { ...existingSettings };
    if (!isEmpty(newSettings)) {
      for (const [key, value] of Object.entries(newSettings)) {
        updatedSettings[key] = value;
      }
    }
    return updatedSettings;
  }

  async changePassword(options: { id: any; previousPassword: string; password: string }): Promise<any> {
    const { id, previousPassword, password } = options;
    const existingUser = await this.userRepository.findOne({ id });
    const userToUpdate = await this.setPasswordWhenRightPrevPass(existingUser, previousPassword, password);
    await this.userRepository.save(userToUpdate);
    return this.userRepository.findOne({ id });
  }

  async setPasswordWhenRightPrevPass(user: User, previousPassword: string, newPassword: string): Promise<User> {
    if (user.password && newPassword) {
      if (!(await passwordsAreEqual({ hashedPassword: user.password, plainPassword: previousPassword }))) {
        throw new HttpException('Previous password is not correct', 400);
      }
      user = await plainToClass(User, user).setPassword(newPassword);
    }
    return user;
  }

  deviceLoginHistory({ user }) {
    return this.userDeviceMetadataRepository.find({ user });
  }

  async deleteAccount(user: Partial<User>): Promise<{ id: string; description: string }> {
    const detailedUser: User = await this.detailedUser(user.id);

    const manager = this.connection.manager;
    await manager.transaction(async (transactionManager: EntityManager) => {
      await transactionManager.remove(Resources.OAUTH_TOKENS_ACCESSTOKENS, detailedUser.oAuthTokens);
      await transactionManager
        .createQueryBuilder()
        .delete()
        .from(UserDeviceMetadataEntity)
        .where('userId = :id', { id: detailedUser.id })
        .execute();
      await transactionManager
        .createQueryBuilder()
        .delete()
        .from(Notification)
        .where('userId = :id', { id: detailedUser.id })
        .execute();

      await this.deleteOwnedWorkspacesAndTheirDependecies({ user: detailedUser, transactionManager });
      await this.deleteSubscriptionsOfUser({ user: detailedUser });

      await transactionManager.remove(Resources.USERS, detailedUser);

      this.mailMembersOfOwnedWorkspaces(detailedUser);
    });

    return { id: user.id, description: 'Deleted' };
  }

  private mailMembersOfOwnedWorkspaces(user: User): void {
    if (user.ownedWorkspace.length > 0) {
      user.ownedWorkspace.forEach((workspace) => {
        void new PromisePool()
          .for(workspace.members)
          .withConcurrency(10)
          .process(async (member: User) =>
            this.workspaceService.notifyUserByEmail({ workspace, user: member }).catch(),
          );
      });
    }
  }

  private async deleteSubscriptionsOfUser(options: { user: User }) {
    return await this.subscriptionService.cancelSubscription({ user: options.user });
  }

  private async deleteOwnedWorkspacesAndTheirDependecies(options: {
    user: User;
    transactionManager: EntityManager;
  }): Promise<void> {
    const { user, transactionManager } = options;
    const ownedWorkspaces = user.ownedWorkspace;
    if (ownedWorkspaces.length > 0) {
      const ownedWorkspacesIds = ownedWorkspaces.map((workspace) => workspace.id);
      const files: File[] = await transactionManager
        .createQueryBuilder(File, 'file')
        .select()
        .where('file.workspaceId IN(:...ids)', { ids: ownedWorkspacesIds })
        .getMany();
      if (files.length > 0) {
        const { errors } = await new PromisePool()
          .for(files)
          .process(async (file: File) => this.fileService.delete(file.id));
        if (errors) {
          this.logger.error(errors);
          throw errors;
        }
      }

      await transactionManager
        .createQueryBuilder(AdTemplate, 'ad-template')
        .delete()
        .where('workspaceId IN(:...ids)', { ids: ownedWorkspacesIds })
        .execute();

      await this.deletePostsOfOwnedWorkspaces({ user, transactionManager });

      await transactionManager.remove(Resources.WORKSPACES, user.ownedWorkspace);
    }
  }

  private async deletePostsOfOwnedWorkspaces(options: {
    user: User;
    transactionManager: EntityManager;
  }): Promise<void> {
    const { user, transactionManager } = options;
    const { errors } = await new PromisePool().for(user.ownedWorkspace).process(async (workspace: Workspace) => {
      if (workspace.adAccounts.length > 0) {
        const adAccountIds = workspace.adAccounts.map((adAccount) => adAccount.id);
        const posts = await getRepository(Resources.POSTS)
          .createQueryBuilder(Resources.POSTS)
          .select(`${Resources.POSTS}.providerId`)
          .innerJoin(`${Resources.POSTS}.adAccounts`, `adAccount`)
          .where('adAccount.id IN(:...ids)', {
            ids: adAccountIds,
          })
          .getMany();
        if (posts.length > 0) {
          const fetchedPostIds = posts.map((post: Post) => post.providerId);
          await transactionManager
            .createQueryBuilder(Post, Resources.POSTS)
            .delete()
            .where('providerId IN(:...ids)', { ids: fetchedPostIds })
            .execute();
        }
      }
    });
    if (errors.length > 0) {
      this.logger.error(errors);
      throw errors;
    }
  }

  private getIntercomUserIdentifier(options: { userId: string; key: string }): string {
    const { userId, key } = options;
    return createHmac('sha256', key).update(userId).digest('hex');
  }
}
