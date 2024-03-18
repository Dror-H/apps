import { EnvironmentType } from '@instigo-app/data-transfer-object';
import { SlackNotificationService } from '@instigo-app/slack-notification';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format, subDays } from 'date-fns';
import { Connection, MoreThan } from 'typeorm';
import { User } from '../data/user.entity';

@Injectable()
export class UserSlackReportsService implements OnModuleInit {
  onModuleInit() {
    void this.reportOnSlack().then();
  }
  private readonly logger = new Logger(UserSlackReportsService.name);

  @Inject(SlackNotificationService)
  private readonly slackNotificationService: SlackNotificationService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(Connection)
  private readonly connection: Connection;

  async reportOnSlack(): Promise<void> {
    if (this.configService.get('ENVIRONMENT') === EnvironmentType.PRODUCTION) {
      const currentDate = new Date();

      const last7DaysNewUser = await this.connection
        .createQueryBuilder(User, 'user')
        .select()
        .where({ createdAt: MoreThan(subDays(currentDate, 7)) })
        .getCount();

      const last30DaysNewUser = await this.connection
        .createQueryBuilder(User, 'user')
        .select()
        .where({ createdAt: MoreThan(subDays(currentDate, 30)) })
        .getCount();

      const totalUsers = await this.connection.createQueryBuilder(User, 'user').select().getCount();

      const newUserNotification = {
        text: 'Daily User report 📄',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Daily User report 📄 on ${format(currentDate, 'dd-MMM-yyyy')}`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `New users in the last 7 days: *${last7DaysNewUser}*\nNew users in the last 30 days: *${last30DaysNewUser}*\nTotal Users: ${totalUsers}\n`,
            },
          },
        ],
      };
      await this.slackNotificationService.sendNotification(newUserNotification).catch((err) => {
        this.logger.error(err);
      });
    }
  }
}
