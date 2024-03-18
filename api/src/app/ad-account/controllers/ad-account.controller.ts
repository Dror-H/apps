import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import {
  Actions,
  AdAccountDTO,
  AvailableAdAccountsDTO,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Get, Inject, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Crud, CrudController, Override, ParsedBody } from '@nestjsx/crud';
import { AdAccount } from '../data/ad-account.entity';
import { AdAccountNestCrudService } from '../services/ad-account.nestcrud.service';
import { AdAccountService } from '../services/ad-account.service';
import { AvailableAdAccountsForIntegrationService } from '../services/available-ad-accounts-for-integration.service';

@Crud({
  model: {
    type: AdAccountDTO,
  },
  routes: {
    exclude: ['updateOneBase', 'replaceOneBase', 'getManyBase'],
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    join: {
      workspace: {
        eager: true,
        allow: ['id'],
      },
      pages: {
        eager: true,
        allow: ['providerId'],
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.AD_ACCOUNTS })
export class AdAccountController implements CrudController<AdAccount> {
  @Inject(AvailableAdAccountsForIntegrationService)
  private readonly availableAdAccountsForIntegrationService: AvailableAdAccountsForIntegrationService;

  @Inject(AdAccountService)
  private readonly adAccountService: AdAccountService;

  constructor(public service: AdAccountNestCrudService) {}

  @Action(Actions.READ_AVAILABLE)
  @ApiResponse({
    status: 200,
    description: 'get available adaccount for integration with a extra used flag',
    type: [AvailableAdAccountsDTO],
  })
  @Get('available/:provider')
  async getAvailableAdAccounts(
    @CurrentUser() user: User,
    @Param('provider') provider: SupportedProviders,
  ): Promise<AvailableAdAccountsDTO[]> {
    return this.availableAdAccountsForIntegrationService.getAvailableAdAccounts({
      user,
      provider,
    });
  }

  @Action(Actions.CreateMany)
  @Override('createManyBase')
  async bulkCreateAdAccounts(
    @ParsedBody() { bulk: adAccounts }: { bulk: Partial<AdAccountDTO[]> },
  ): Promise<AdAccountDTO[]> {
    return await this.adAccountService.bulkCreate(adAccounts);
  }

  @Action(Actions.ReadOne)
  @ApiResponse({
    status: 200,
    description: 'check tos of an ad account',
  })
  @Get('check-tos/:id')
  async checkAdAccountTos(
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: Workspace,
    @Param('id') adAccountProviderId: string,
  ): Promise<any> {
    return this.availableAdAccountsForIntegrationService.checkAdAccountTos({
      workspace,
      adAccountProviderId,
    });
  }

  @Action(Actions.ReadOne)
  @ApiResponse({
    status: 200,
    description: 'check tos of an page',
  })
  @Get('check-tos-page/:id')
  async checkPageTos(
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: Workspace,
    @Param('id') pageProviderId: string,
  ): Promise<{ leadgen_tos_accepted: boolean }> {
    return this.availableAdAccountsForIntegrationService.checkPageTos({
      workspace,
      pageProviderId,
    });
  }
}
