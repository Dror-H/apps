import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { MissingParameterException, ParseJSONPipe } from '@instigo-app/api-shared';
import {
  Actions,
  BrowseOutput,
  InstigoTargetingTypes,
  ReachOutputDto,
  Resources,
  SearchOutputDto,
  SupportedProviders,
  TargetingConditionDto,
  TargetingDto,
  TargetingSubTypes,
  TargetingTemplateDto,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { Body, Delete, Get, Inject, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Action, Crud, CrudController, Override } from '@nestjsx/crud';
import { CheckTargetingIdsFilter } from '../data/targeting-ids';
import { TargetingTemplate } from '../data/targeting-template.entity';
import { TargetingSearchService } from '../service/targeting-search.service';
import { TargetingTemplateNestCrudService } from '../service/targeting-template.nestcrud.service';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';

@Crud({
  model: {
    type: TargetingTemplateDto,
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
      adAccount: {
        eager: true,
      },
      'adAccount.workspace': {
        eager: true,
        select: false,
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.TARGETING_TEMPLATES })
export class TargetingTemplateController implements CrudController<TargetingTemplate> {
  @Inject(TargetingSearchService) targetingSearchService: TargetingSearchService;

  constructor(public service: TargetingTemplateNestCrudService) {}

  @Action(Actions.DeleteOne)
  @Override('deleteOneBase')
  async deleteTargeting(@Param('id') targetingId: string): Promise<{ id: string }> {
    return { id: await this.service.deleteById(targetingId) };
  }

  @Action(Actions.DeleteAll)
  @Delete()
  async deleteManyTargeting(
    @Query(new ValidationPipe({ transform: true })) { targetingIds }: CheckTargetingIdsFilter,
  ): Promise<string[]> {
    if (!targetingIds || !targetingIds.length) {
      throw new MissingParameterException({ parameter: 'targetingIds list' });
    }
    return this.service.deleteByIds(targetingIds);
  }

  @ApiResponse({
    status: 200,
    description: 'get suggestions based on the current selection',
    type: SearchOutputDto,
    isArray: true,
  })
  @Action(Actions.SEARCH)
  @Put('suggestions')
  async suggestions(
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
    @Query('provider') provider: SupportedProviders,
    @Query('adAccountProviderId') adAccountProviderId: string,
    @Body('targeting') selected: TargetingConditionDto[],
  ) {
    const { accessToken } = currentWorkspace.owner.getAccessToken({ provider });
    return this.targetingSearchService.suggestions({ accessToken, provider, selected, adAccountProviderId });
  }

  @ApiResponse({
    status: 200,
    description: 'Search targeting criteria given a provider',
    type: SearchOutputDto,
    isArray: true,
  })
  @Action(Actions.SEARCH)
  @Get('search')
  async search(
    @CurrentWorkspaceId() workspaceId: string,
    @Query('provider') provider: SupportedProviders,
    @Query('searchQuery') searchQuery?: string,
    @Query('type') type?: InstigoTargetingTypes,
    @Query('providerSubType') providerSubType?: TargetingSubTypes,
    @Query('adAccountProviderId') adAccountProviderId?: string,
  ) {
    return this.targetingSearchService.search({
      adAccountProviderId,
      provider,
      providerSubType,
      workspaceId,
      searchQuery,
      type,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Get audience reach estimation from the targeting, given a provider',
    type: ReachOutputDto,
  })
  @Action(Actions.REACH)
  @Post('reach')
  async reach(
    @CurrentWorkspaceId() workspaceId: string,
    @Query('provider') provider: SupportedProviders,
    @Body('targeting') targeting: TargetingDto,
    @Query('adAccountProviderId') adAccountProviderId?: string,
  ): Promise<ReachOutputDto> {
    return this.targetingSearchService.reach({ adAccountProviderId, provider, workspaceId, targeting });
  }

  @ApiResponse({
    status: 200,
    description: 'Get the targeting tree with possible types and entities, given a provider',
  })
  @Action(Actions.SEARCH)
  @Get('browse')
  async browse(
    @CurrentWorkspaceId() workspaceId: string,
    @Query('provider') provider: SupportedProviders,
    @Query('limitTypes', ParseJSONPipe) limitTypes?: InstigoTargetingTypes[],
    @Query('adAccountProviderId') adAccountProviderId?: string,
  ): Promise<BrowseOutput> {
    return this.targetingSearchService.browse({ adAccountProviderId, limitTypes, workspaceId, provider });
  }
}
