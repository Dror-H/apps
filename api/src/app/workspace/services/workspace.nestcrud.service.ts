import { UserRepository } from '@api/user/data/user.repository';
import { InvalidTokenStatusException, MissingOAuthTokenException } from '@instigo-app/api-shared';
import { SupportedProviders, TokenStatus } from '@instigo-app/data-transfer-object';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Workspace } from '../data/workspace.entity';
import { WorkspaceRepository } from '../data/workspace.repository';

@Injectable()
export class WorkspaceNestCrudService extends TypeOrmCrudService<Workspace> {
  @Inject(UserRepository) private readonly userRepository: UserRepository;

  constructor(@Inject(WorkspaceRepository) repo: WorkspaceRepository) {
    super(repo);
  }

  async findWorkspaceOwnerOauthToken(workspaceId: string, provider: SupportedProviders): Promise<string> {
    const workspace = await this.repo.findOneOrFail(workspaceId);
    const owner = await this.userRepository.findOneOrFail({
      where: { id: workspace.owner.id },
      relations: ['oAuthTokens'],
    });
    const oAuthToken = owner.getAccessToken({ provider });
    if (!oAuthToken) {
      throw new MissingOAuthTokenException({ provider });
    }
    if (oAuthToken.status !== TokenStatus.ACTIVE) {
      throw new InvalidTokenStatusException({ status: oAuthToken.status, provider });
    }
    return oAuthToken.accessToken;
  }
}
