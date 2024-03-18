import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { QueueNames, QueueProcessNames, ResponseError, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { differenceInMinutes } from 'date-fns';
import { Connection, UpdateResult } from 'typeorm';

@Injectable()
export class DataSynchronizationService {
  private readonly logger = new Logger('DataSynchronizationService');

  constructor(
    @InjectQueue(QueueNames.AD_ACCOUNT)
    private readonly adAccountQueue: Queue,
    @InjectQueue(QueueNames.CAMPAIGNS)
    private readonly campaignsQueue: Queue,
    @InjectQueue(QueueNames.AUDIENCES)
    private readonly audiencesQueue: Queue,
    @InjectConnection() private connection: Connection,
  ) {}

  async synchronizeWorkspace(options: { workspace: Partial<Workspace> }) {
    const workspace = await this.connection
      .createQueryBuilder(Workspace, 'workspace')
      .select()
      .where({ id: options.workspace.id })
      .getOne();

    if (Math.abs(differenceInMinutes(new Date(workspace.lastSynced), new Date())) < 15) {
      return new ResponseError('Workspace already synced in the past 15 min', 'app.general.workspace-already-synced');
    }
    const adAccounts = await this.connection
      .createQueryBuilder(AdAccount, 'adAccount')
      .select()
      .where({ workspace: workspace.id })
      .getMany();
    this.logger.log(`Synchronizing ${adAccounts.length} ad accounts`);

    for (const adAccount of adAccounts) {
      adAccount.workspace = workspace;
      await this.syncAdAccount({ adAccount });
    }

    await this.connection
      .createQueryBuilder()
      .update(Workspace)
      .set({ lastSynced: new Date() })
      .where('id = :id', { id: workspace.id })
      .execute();
    return new ResponseSuccess('Synchronization started', 'app.general.data-sync-started');
  }

  async syncAdAccount(options: { adAccount: AdAccount }): Promise<UpdateResult> {
    const { adAccount } = options;
    await this.adAccountQueue.add(QueueProcessNames.FETCH_AD_ACCOUNT, { adAccount }).catch((e) => {
      console.error(e);
    });
    await this.campaignsQueue.add(QueueProcessNames.FETCH_CAMPAIGNS, { adAccount }).catch((e) => {
      console.error(e);
    });
    await this.audiencesQueue.add(QueueProcessNames.FETCH_AUDIENCES, { adAccount }).catch((e) => {
      console.error(e);
    });
    return await this.connection
      .createQueryBuilder()
      .update(AdAccount)
      .set({ lastSynced: new Date() })
      .where('id = :id', { id: adAccount.id })
      .execute();
  }

  async autoSyncWorkspaces() {
    const workspaces = await this.connection
      .createQueryBuilder(Workspace, 'workspace')
      .select()
      .where({ disabled: false })
      .getMany();
    for (const workspace of workspaces) {
      this.synchronizeWorkspace({ workspace }).catch((e) => {
        console.error(e);
      });
    }
  }
}
