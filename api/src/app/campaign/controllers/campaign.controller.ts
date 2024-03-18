import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { MissingParameterException } from '@instigo-app/api-shared';
import {
  Actions,
  LinkedinBidSuggestionsDto,
  CampaignDTO,
  FacebookCampaignDraft,
  LinkedinCampaignDraft,
  Resources,
  SupportedProviders,
  TargetingDto,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Body, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Crud, CrudAuth, CrudController, Override, ParsedBody } from '@nestjsx/crud';
import { CampaignIdsFilter } from '../data/campaign-ids';
import { Campaign } from '../data/campaign.entity';
import { CampaignCreationService } from '../services/facebook/campaign-creation.service';
import { CampaignNestCrudService } from '../services/campaign.nestcrud.service';
import { CampaignService } from '../services/campaign.service';
import { LinkedinCampaignCreationService } from '@api/campaign/services/linkedin/linkedin-campaign-creation.service';

@Crud({
  model: {
    type: CampaignDTO,
  },
  routes: {
    exclude: [],
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
        alias: 'adAccount',
        allow: ['id'],
      },
      'adAccount.workspace': {
        eager: true,
        alias: 'adAccountWorkspace',
        allow: ['id'],
        select: false,
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
@CompositionDecorator({ resource: Resources.CAMPAIGNS })
export class CampaignController implements CrudController<Campaign> {
  constructor(
    public service: CampaignNestCrudService,
    private campaignService: CampaignService,
    private campaignCreation: CampaignCreationService,
    private linkedinCampaignCreation: LinkedinCampaignCreationService,
  ) {}

  @Action(Actions.CreateOne)
  @Override('createOneBase')
  async createCampaign(
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: Workspace,
    @CurrentUser() user: Partial<User>,
    @ParsedBody()
    payload: {
      campaign: FacebookCampaignDraft | LinkedinCampaignDraft;
      campaignDraftId: string;
    },
  ): Promise<FacebookCampaignDraft> {
    if (payload.campaign.settings.provider === SupportedProviders.FACEBOOK) {
      return await this.campaignCreation.create({
        payload: { ...payload, campaign: payload.campaign as unknown as FacebookCampaignDraft },
        workspace,
        user,
      });
    }
    if (payload.campaign.settings.provider === SupportedProviders.LINKEDIN) {
      return await this.linkedinCampaignCreation.create({
        payload: {
          ...payload,
          campaign: payload.campaign as unknown as LinkedinCampaignDraft,
        },
        workspace,
        user,
      });
    }
  }

  @Patch('bulk')
  @Action(Actions.UpdateMany)
  @ApiResponse({ status: 201, description: 'Patch multiple campaigns' })
  bulkPatch(
    @Body('bulk') campaigns: Partial<CampaignDTO>[],
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ) {
    return this.campaignService.bulkPatch({ campaigns, workspace });
  }

  @ApiResponse({
    status: 200,
    description: 'Get the targeting for a specific campaign',
    type: TargetingDto,
    isArray: true,
  })
  @Action(Actions.ReadAll)
  @Get('targeting')
  async findCampaignTargeting(
    @Query('provider') provider: SupportedProviders,
    @Query('campaignId') campaignId: string,
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ) {
    return this.campaignService.findCampaignTargeting({ campaignId, provider, workspace });
  }

  @Action(Actions.DeleteOne)
  @Override('deleteOneBase')
  @ApiResponse({ status: 204, description: 'Deleted' })
  async deleteCampaign(@Param('id') campaignId: string): Promise<{ id: string }> {
    return { id: await this.campaignService.deleteById(campaignId) };
  }

  @Delete()
  @Action(Actions.DeleteMany)
  @ApiResponse({ status: 204, description: 'Deleted' })
  async deleteManyCampaigns(
    @Query(new ValidationPipe({ transform: true })) { campaignIds }: CampaignIdsFilter,
  ): Promise<string[]> {
    if (!campaignIds || !campaignIds.length) {
      throw new MissingParameterException({ parameter: 'campaignIds list' });
    }
    return await this.campaignService.deleteMany(campaignIds);
  }

  @Post('bid-suggestions')
  public async getBiddingSuggestions(
    @Body() campaign: Partial<LinkedinCampaignDraft>,
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ): Promise<LinkedinBidSuggestionsDto> {
    if (campaign.settings.provider === SupportedProviders.LINKEDIN) {
      return await this.campaignService.getBiddingSuggestions(campaign, workspace);
    }
  }
}
