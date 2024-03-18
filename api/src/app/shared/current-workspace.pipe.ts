import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { Injectable, Logger, PipeTransform } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Connection } from 'typeorm';

@Injectable()
export class CurrentWorkspacePipe implements PipeTransform {
  private readonly logger = new Logger(CurrentWorkspacePipe.name);
  constructor(@InjectConnection() private connection: Connection) {}

  async transform(workspaceId: string) {
    try {
      const workspace: any = await this.connection
        .createQueryBuilder(Workspace, 'workspace')
        .select()
        .where({ id: workspaceId })
        .leftJoinAndSelect('workspace.owner', 'owner')
        .leftJoinAndSelect('owner.oAuthTokens', 'oAuthTokens')
        .getOne();
      workspace.owner = plainToClass(User, workspace.owner);
      return workspace || {};
    } catch (e) {
      this.logger.error(e);
      return {};
    }
  }
}
