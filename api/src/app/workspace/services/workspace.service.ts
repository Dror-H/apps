import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { remove } from 'lodash';
import { getManager } from 'typeorm';
import { User } from '../../user/data/user.entity';
import { UserService } from '../../user/services/user.service';
import { Workspace } from '../data/workspace.entity';
import { WorkspaceRepository } from '../data/workspace.repository';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  @Inject(forwardRef(() => UserService)) private readonly userService: UserService;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(WorkspaceRepository)
  private readonly workspaceRepository: WorkspaceRepository;

  async getAssignedWorkspaces(options: { user: Partial<User> }) {
    const { assignedWorkspaces } = await this.userService.getDetailedUser({ id: options.user.id });
    return assignedWorkspaces;
  }

  async delete({ workspace }): Promise<any> {
    return await getManager().transaction(async (transactionalEntityManager) => {
      workspace = await transactionalEntityManager.findOne(Workspace, workspace.id);
      workspace.members = [];
      workspace.owner = null;
      await this.workspaceRepository.save(workspace);
      await this.workspaceRepository.delete({ id: workspace.id });
      await Promise.all(
        workspace.members.map(async (member) => this.notifyUserByEmail({ workspace, user: member }).catch()),
      );
    });
  }

  async leave(id: string, user: Partial<User>): Promise<any> {
    const workspace = await this.workspaceRepository.findOneOrFail(id);
    remove(workspace.members, (member) => member.id === user.id);
    return this.workspaceRepository.save(workspace);
  }

  async notifyUserByEmail(options: { workspace: Workspace; user: User }): Promise<string> {
    const { workspace, user } = options;
    const mail: ISendMailOptions = {
      to: user.email,
      subject: 'Workspace was deleted',
      template: 'workspace-has-been-deleted',
      context: { workspace: workspace?.name, name: user.fullName },
    };
    await this.mailerService.sendMail(mail).catch((err) => {
      this.logger.error(err);
    });
    return 'email sent';
  }
}
