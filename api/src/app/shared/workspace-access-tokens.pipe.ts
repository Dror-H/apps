import { Injectable, PipeTransform } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { User } from '@api/user/data/user.entity';
import { OauthTokensAccesstoken } from '@api/auth/data/oauth-tokens-accesstoken.entity';

@Injectable()
export class WorkspaceAccessTokens implements PipeTransform {
  async transform(workspaceId: string): Promise<Partial<OauthTokensAccesstoken>[]> {
    try {
      const workspace: any = await getRepository('workspaces').findOne({ id: workspaceId });
      const owner: Partial<User> = await getRepository('users').findOneOrFail({
        where: { id: workspace.owner.id },
        relations: ['oAuthTokens'],
      });
      return owner.oAuthTokens.filter((token) => token.scope === 'authorizeApp');
    } catch (e) {
      return [];
    }
  }
}
