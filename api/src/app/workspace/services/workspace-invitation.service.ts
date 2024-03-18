import { User } from '../../user/data/user.entity';
import { EmailNotSentException, InstanceNotFoundException, PrettyLinkService } from '@instigo-app/api-shared';
import {
  InstigoNotification,
  NotificationSupportedProviders,
  NotificationType,
  NOTIFICATION_EVENT,
  Resources,
} from '@instigo-app/data-transfer-object';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { RedirectOptions } from '@nestjsplus/redirect';
import { plainToClass } from 'class-transformer';
import { format } from 'date-fns';
import * as jwt from 'jsonwebtoken';
import { remove } from 'lodash';
import { Connection, EntityManager } from 'typeorm';
import { Workspace } from '../data/workspace.entity';
import { WorkspaceRepository } from '../data/workspace.repository';

@Injectable()
export class WorkspaceInvitationService {
  readonly logger = new Logger(WorkspaceInvitationService.name);

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(Connection)
  private readonly connection: Connection;

  @Inject(WorkspaceRepository)
  private readonly workspaceRepository: WorkspaceRepository;

  @Inject(PrettyLinkService)
  private readonly prettyLinkService: PrettyLinkService;

  constructor(private readonly eventEmitter: EventEmitter2) {}
  async sendInviteMail(options: { email: string; workspaceId: string }): Promise<User> {
    const { email, workspaceId } = options;
    const manager = this.connection.manager;

    return await manager.transaction(async (transactionManager: EntityManager) => {
      const user = await this.findOrCreateUserForEmail({ email }, transactionManager);
      await this.addUserInPendingToWorkspace({ user, workspaceId }, transactionManager);

      const { token } = this.createJwtTokenForEmail({
        user,
        workspaceId,
        secret: user.password,
        scope: 'inviteToWorkspace',
        signOptions: { expiresIn: '24h' },
      });
      const mailerOptions = await this.buildMailerOptions({ userEmail: email, token, name: user.fullName });

      try {
        await this.mailerService.sendMail(mailerOptions);
        const message = `Invitation email was successfully sent to: ${user.email}`;
        this.eventEmitter.emit(
          NOTIFICATION_EVENT,
          new InstigoNotification({
            title: message,
            description: message,
            provider: NotificationSupportedProviders.INSTIGO,
            type: NotificationType.SUCCESS,
            workspace: { id: workspaceId },
          }),
        );
        this.logger.log(message);
        delete user.password;
        return user;
      } catch (error) {
        this.logger.log(error);
        throw new EmailNotSentException({ email: user.email, subject: 'invitation' });
      }
    });
  }

  async findOrCreateUserForEmail(options: { email }, transactionManager: EntityManager): Promise<User> {
    const { email } = options;
    let user = (await transactionManager.findOne(Resources.USERS, { email })) as User;
    if (!user) {
      user = await plainToClass(User, { email, password: email, isActive: false }).setPassword(email);
      user = (await transactionManager.save(Resources.USERS, { email, password: email, isActive: false })) as User;
    }
    return user;
  }

  async addUserInPendingToWorkspace(
    options: { user: User; workspaceId: string },
    transactionManager: EntityManager,
  ): Promise<Workspace> {
    const { user, workspaceId } = options;
    try {
      const workspace = (await transactionManager.findOneOrFail(Resources.WORKSPACES, {
        id: workspaceId,
      })) as Workspace;
      workspace.inPendingMembers.push(user);
      return await transactionManager.save(Resources.WORKSPACES, workspace);
    } catch (error) {
      throw new InstanceNotFoundException({ entity: 'Workspace', id: workspaceId });
    }
  }

  async verifyInvitationEmail(options: { token: string }): Promise<RedirectOptions> {
    const { token } = options;
    const payload = jwt.decode(token);
    const { user, workspaceId } = payload as any;

    const manager = this.connection.manager;
    return manager.transaction(async (transactionManager: EntityManager) => {
      const realUser = (await transactionManager.findOneOrFail(Resources.USERS, { id: user.id })) as User;
      jwt.verify(token, realUser.password);

      const workspace = await this.removeUserFromInPendingMembers({ user: realUser, workspaceId }, transactionManager);
      const updatedUser = await this.updateUserAsActive({ user: realUser }, transactionManager);
      await this.addUserToMembers({ user: updatedUser, workspace }, transactionManager);

      const { token: newToken } = this.createJwtToken({ user: updatedUser });
      if (!updatedUser.onboarding.completed) {
        const url = `${this.configService.get('FRONTEND_HOST')}/onboarding/invited-member/${newToken}`;
        return {
          statusCode: HttpStatus.FOUND,
          url,
        };
      }
      return { statusCode: HttpStatus.FOUND, url: `${this.configService.get('FRONTEND_HOST')}/token/${newToken}` };
    });
  }

  async removeUserFromInPendingMembers(
    options: { user: User; workspaceId: string },
    transactionManager: EntityManager,
  ): Promise<Workspace> {
    const { user, workspaceId } = options;
    try {
      const workspace = (await transactionManager.findOneOrFail(Resources.WORKSPACES, {
        id: workspaceId,
      })) as Workspace;
      remove(workspace.inPendingMembers, (member) => member.id === user.id);
      return await this.workspaceRepository.save(workspace);
    } catch (error) {
      throw new InstanceNotFoundException({ entity: 'Workspace', id: workspaceId });
    }
  }

  async updateUserAsActive(options: { user: User }, transactionManager: EntityManager): Promise<User> {
    const { user } = options;
    user.isActive = true;
    return transactionManager.save(Resources.USERS, user);
  }

  async addUserToMembers(
    options: { user: User; workspace: Workspace },
    transactionManager: EntityManager,
  ): Promise<Workspace> {
    const { user, workspace } = options;
    workspace.members.push(user);
    return transactionManager.save(Resources.WORKSPACES, workspace);
  }

  async buildMailerOptions(options: { userEmail: string; token: string; name?: string }): Promise<ISendMailOptions> {
    const { userEmail, token, name } = options;
    return {
      to: userEmail,
      subject: 'Invite to workspace - Instigo',
      template: 'workspace-invitation-email',
      context: {
        action_url: await this.prettyLinkService.workspaceInvitationShortUrl(token),
        name,
      },
    };
  }

  public createJwtTokenForEmail(options: {
    user: any;
    workspaceId: string;
    secret: string;
    scope?: string;
    signOptions?: any;
  }): { token: string } {
    const { user, scope, signOptions, secret, workspaceId } = options;
    const token: string = jwt.sign(
      {
        user: { id: user.id, onboarding: user.onboarding, email: user.email, roles: user.roles },
        scope,
        workspaceId,
        createAt: format(new Date(), 'PPpp'),
      },
      secret,
      signOptions,
    );
    return { token };
  }

  public createJwtToken(options: { user: any; scope?: string; signOptions?: any }): { token: string } {
    const { user, scope, signOptions } = options;
    const token: string = this.jwtService.sign(
      {
        user: { id: user.id, onboarding: user.onboarding, email: user.email, roles: user.roles },
        scope,
        createAt: format(new Date(), 'PPpp'),
      },
      signOptions,
    );
    return { token };
  }
}
