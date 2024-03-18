import { config } from '@instigo-app/api-shared';
import { EnvironmentType } from '@instigo-app/data-transfer-object';
import { SlackNotificationService } from '@instigo-app/slack-notification';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private slackNotificationService: SlackNotificationService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>) {
    const { entity } = event;
    if (config().environment === EnvironmentType.PRODUCTION) {
      const newUserNotification = {
        text: 'New user in instigo 🚀',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'There is a new user in the instigo platform 🚀',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${entity?.firstName || ''} ${entity?.lastName || ''}*\n email: ${entity.email}`,
            },
            accessory: {
              type: 'image',
              image_url: `${
                entity.pictureUrl ||
                'https://instigo.ams3.digitaloceanspaces.com/public/general_assets/user_place_holder.jpg'
              }`,
              alt_text: 'alt text for image',
            },
          },
        ],
      };
      await this.slackNotificationService.sendNotification(newUserNotification).catch((err) => {
        console.log(err);
      });
    }
  }
}
