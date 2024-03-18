import { Workspace } from '@api/workspace/data/workspace.entity';
import { sleep } from '@instigo-app/api-shared';
import {
  InstigoNotification,
  NOTIFICATION_EVENT,
  WORKSPACE_NOTIFICATION_EVENT,
  WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL,
} from '@instigo-app/data-transfer-object';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { Repository } from 'typeorm';
import { NotificationRepository } from './notification.repository';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class HandleNotificationService {
  private readonly logger = new Logger('HandleNotificationService');

  @Inject(NotificationRepository)
  private readonly notificationService: NotificationRepository;

  @InjectRepository(Workspace)
  private readonly workspaceRepository: Repository<Workspace>;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @OnEvent(NOTIFICATION_EVENT)
  async handleNewInstigoNotification(payload: InstigoNotification) {
    await this.notificationService.save(payload);
  }

  @OnEvent(WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL)
  async handleNewWorkspaceNotificationEmail(payload: InstigoNotification) {
    const workspace = await this.workspaceRepository.findOne({ id: payload.workspace.id });
    const { members } = workspace;
    const notifications = members.map((member) => ({ ...payload, user: member }));
    await to(this.notifyUsersByEmail({ notifications }));
    await this.notificationService
      .createQueryBuilder()
      .insert()
      .values(notifications)
      .orUpdate({
        conflict_target: ['provider_id', 'read', 'userId', 'workspaceId'],
        overwrite: ['read'],
      })
      .execute();
    return notifications;
  }

  @OnEvent(WORKSPACE_NOTIFICATION_EVENT)
  async handleNewWorkspaceNotification(payload: InstigoNotification) {
    const workspace = await this.workspaceRepository.findOne({ id: payload.workspace.id });
    const { members } = workspace;
    const notifications = members.map((member) => ({ ...payload, user: member, read: false }));
    await this.notificationService
      .createQueryBuilder()
      .insert()
      .values(notifications)
      .orUpdate({
        conflict_target: ['provider_id', 'read', 'userId', 'workspaceId'],
        overwrite: ['read'],
      })
      .execute();

    return notifications;
  }

  async notifyUsersByEmail({ notifications }) {
    const { results, errors } = await new PromisePool().for(notifications).process(async (notification) => {
      const mailerOptions = this.sendMailOptions({ notification });
      await sleep(50);
      const { accepted } = await this.mailerService.sendMail(mailerOptions);
      return accepted.length > 0;
    });
    if (errors.length > 0) {
      this.logger.error(errors);
    }
    return results;
  }

  sendMailOptions({ notification }): ISendMailOptions {
    const { user, title, description, type, template, context } = notification;
    if (template) {
      return {
        to: user.email,
        subject: 'Instigo notification - Instigo',
        template: `${template}`,
        context,
      };
    }

    return {
      to: user.email,
      subject: 'Instigo notification - Instigo',
      template: 'notification',
      context: {
        title,
        description,
        success: type === 'success',
        error: type === 'error',
        warning: type === 'warning',
        info: type === 'info',
      },
    };
  }
}
