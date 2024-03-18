import { User } from '@api/user/data/user.entity';
import { Profile, TokenStatus } from '@instigo-app/data-transfer-object';
import { fromUnixTime } from 'date-fns';
import { EntityRepository, Repository } from 'typeorm';
import { StateScope } from '../auth.module';
import { OauthTokensAccesstoken } from './oauth-tokens-accesstoken.entity';

@EntityRepository(OauthTokensAccesstoken)
export class OauthTokenRepository extends Repository<OauthTokensAccesstoken> {
  public async addTokenToUser(options: {
    user: User;
    profile: Profile;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    grantedAt: number;
    scope: StateScope;
  }): Promise<OauthTokensAccesstoken> {
    const { user, profile, accessToken, refreshToken, expiresAt, grantedAt, scope } = options;
    const oauthTokensAccesstoken: Partial<OauthTokensAccesstoken> = {
      user,
      status: TokenStatus.ACTIVE,
      providerClientId: profile.id,
      provider: profile.provider,
      accessToken,
      refreshToken,
      expiresAt: fromUnixTime(expiresAt),
      grantedAt: fromUnixTime(grantedAt),
      scope,
    };
    return this.save(oauthTokensAccesstoken);
  }
}
