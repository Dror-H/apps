import { Notification } from '@api/notification/data/notification.entity';
import { NotificationSupportedProviders, ResponseSuccess } from '@instigo-app/data-transfer-object';
import to from 'await-to-js';
import { uniqBy } from 'lodash';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  async notifications({ workspace, user }): Promise<Notification[]> {
    const userNotifications = await this.createQueryBuilder()
      .select()
      .where({ user, read: false, provider: NotificationSupportedProviders.INSTIGO })
      .orderBy('"createdAt"', 'DESC')
      .take(2)
      .getMany();

    const workspaceNotifications = await this.createQueryBuilder()
      .select()
      .where({ workspace, read: false, provider: NotificationSupportedProviders.INSTIGO })
      .orderBy('"createdAt"', 'DESC')
      .take(2)
      .getMany();
    return uniqBy([...userNotifications, ...workspaceNotifications], 'id');
  }

  async bannerNotifications({ workspace, user }) {
    const notifications = await this.createQueryBuilder()
      .select()
      .where({ user: user.id, workspace: workspace.id, banner: true, read: false })
      .orderBy('"createdAt"', 'DESC')
      .take(2)
      .getMany();
    return notifications;
  }

  async activity({ workspace, take = 10 }) {
    const [result, total] = await this.findAndCount({
      where: { workspace },
      order: {
        createdAt: 'DESC',
      },
      take,
    });

    return {
      data: result,
      count: total,
    };
  }

  async markAsReadNotification({ notification }) {
    const marked = notification.map((n) => ({ ...n, read: true }));
    const [error] = await to(this.save(marked));
    if (error) {
      await this.delete(marked);
    }
    return new ResponseSuccess(`successfully marked`);
  }
}
