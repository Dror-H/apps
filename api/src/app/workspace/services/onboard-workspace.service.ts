import { AdAccountService } from '@api/ad-account/services/ad-account.service';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { WorkspaceOnboardingExecution } from '@instigo-app/api-shared';
import { ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Inject, Injectable } from '@nestjs/common';
import to from 'await-to-js';
import { countBy, isEmpty } from 'lodash';
import { getRepository } from 'typeorm';

@Injectable()
export class OnboardWorkspaceService {
  @Inject(AdAccountService)
  private adAccountService: AdAccountService;

  async onboardWorkspace({ user, workspace, adAccounts }) {
    try {
      workspace = {
        name: workspace,
        owner: user.id,
        members: [{ id: user.id }],
        description: workspace,
        settings: {
          defaultCurrency: isEmpty(adAccounts) ? 'USD' : Object.keys(countBy(adAccounts || [], 'currency'))[0],
        },
        adAccounts: [],
      };
      workspace = await getRepository(Workspace).save(workspace);
      if (!isEmpty(adAccounts)) {
        adAccounts = adAccounts?.map((adAccount) => ({ ...adAccount, workspace: { id: workspace.id } })) || [];
        adAccounts = await this.adAccountService.saveAdAccounts(adAccounts);
      }
      await getRepository(User).update(user.id, { onboarding: { completed: true } });
      user = await getRepository(User).findOne(user.id);
      delete user.password;
      return new ResponseSuccess(user);
    } catch (error) {
      const [err1, res1] = await to(this.adAccountService.deleteAdAccounts(adAccounts));
      workspace.members = [];
      const [err2, res2] = await to(getRepository(Workspace).save(workspace));
      const [err3, res3] = await to(getRepository(Workspace).delete(workspace.id));
      const [err4, res4] = await to(getRepository(User).update(user.id, { onboarding: { completed: false } }));
      console.log(err1, res1, err2, res2, err3, res3, err4, res4);
      throw new WorkspaceOnboardingExecution({ user, workspace });
    }
  }
}
