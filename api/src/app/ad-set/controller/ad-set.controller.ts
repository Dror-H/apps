import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import {
  Actions,
  AdSetCreationDTO,
  AdSetDTO,
  Resources,
  SupportedProviders,
  TargetingDto,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Crud, CrudAuth, CrudController, Override, ParsedBody } from '@nestjsx/crud';
import { AdSet } from '../data/ad-set.entity';
import { AdSetNestCrudService } from '../service/ad-set.nestcrud.service';
import { Body, Get, Patch, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AdSetService } from '../service/ad-set.service';

@Crud({
  model: {
    type: AdSetDTO,
  },
  routes: {},
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    join: {
      adAccount: {
        eager: true,
        alias: 'adAccount',
        allow: ['id'],
      },
      'adAccount.workspace': {
        eager: true,
        alias: 'adAccountWorkspace',
        allow: ['id'],
        select: false,
      },
      campaign: {
        eager: true,
        alias: 'campaign',
        allow: ['id'],
      },
    },
  },
})
@CrudAuth({
  filter: (request) => {
    const currentWorkspaceId = request.headers['current-workspace'];
    return { 'adAccountWorkspace.id': currentWorkspaceId };
  },
})
@CompositionDecorator({ resource: Resources.AD_SETS })
export class AdSetController implements CrudController<AdSet> {
  constructor(public service: AdSetNestCrudService, public adSetService: AdSetService) {}

  @Action(Actions.CreateOne)
  @Override('createOneBase')
  createAdSet(
    @ParsedBody() adSetToCreate: Partial<AdSetCreationDTO>,
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
  ): Promise<AdSetDTO> {
    return this.adSetService.create(adSetToCreate, currentWorkspace);
  }

  @Patch('bulk')
  @Action(Actions.UpdateMany)
  @ApiResponse({ status: 201, description: 'Patch multiple ad-sets' })
  bulkPatch(
    @Body('bulk') adSets: Partial<AdSetDTO>[],
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ) {
    return this.adSetService.bulkPatch({ adSets, workspace });
  }

  @ApiResponse({
    status: 200,
    description: 'Get the targeting for a specific ad set',
    type: TargetingDto,
    isArray: true,
  })
  @Action(Actions.ReadAll)
  @Get('targeting')
  findAdSetTargeting(
    @Query('provider') provider: SupportedProviders,
    @Query('adSetId') adSetId: string,
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ) {
    return this.adSetService.findAdSetTargeting({ adSetId, provider, workspace });
  }
}
