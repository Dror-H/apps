import { QueueNames, QueueProcessNames } from '@instigo-app/data-transfer-object';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { AdAccount } from './ad-account.entity';

@Injectable()
export class AdAccountSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectQueue(QueueNames.CAMPAIGNS) private readonly campaigns: Queue,
    @InjectQueue(QueueNames.AUDIENCES) private readonly audiences: Queue,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return AdAccount;
  }

  async afterInsert(event: InsertEvent<AdAccount>) {
    const { entity } = event;
    await this.campaigns.add(QueueProcessNames.FETCH_CAMPAIGNS, { adAccount: entity });
    await this.audiences.add(QueueProcessNames.FETCH_AUDIENCES, { adAccount: entity });
  }
}
