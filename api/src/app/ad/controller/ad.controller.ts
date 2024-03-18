import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { Actions, AdCreationDTO, AdDTO, AdUpdateDTO, Resources, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Crud, CrudAuth, CrudController, Override, ParsedBody } from '@nestjsx/crud';
import { Ad } from '../data/ad.entity';
import { AdNestCrudService } from '../service/ad.nestcrud.service';
import { Body, Patch, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AdService } from '@api/ad/service/ad.service';

@Crud({
  model: {
    type: AdDTO,
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
        allow: ['id', 'provider', 'providerId'],
      },
      'adAccount.workspace': {
        eager: true,
        alias: 'adAccountWorkspace',
        allow: ['id'],
        select: false,
      },
      campaign: {
        eager: true,
        allow: ['id'],
      },
      adSet: {
        eager: true,
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
@CompositionDecorator({ resource: Resources.ADS })
export class AdController implements CrudController<Ad> {
  constructor(public service: AdNestCrudService, private adService: AdService) {}

  @Action(Actions.CreateOne)
  @Override('createOneBase')
  async createAd(
    @ParsedBody() adToCreate: Partial<AdCreationDTO<any>>,
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
  ): Promise<AdDTO> {
    return this.adService.create(adToCreate, currentWorkspace);
  }

  @Action(Actions.CreateMany)
  @Override('createManyBase')
  async createAds(
    @ParsedBody() { bulk: ads }: { bulk: Partial<AdCreationDTO<any>>[] },
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
  ): Promise<AdDTO[]> {
    return this.adService.bulkCreate(ads, currentWorkspace);
  }

  @Action(Actions.UpdateOne)
  @Post('updateAd')
  async updateAd(
    @Body() { payload: ad }: { payload: AdUpdateDTO },
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
  ): Promise<Ad> {
    return this.adService.updateOne(ad, currentWorkspace);
  }

  @Patch('bulk')
  @Action(Actions.UpdateMany)
  @ApiResponse({ status: 201, description: 'Patch multiple ads' })
  bulkPatch(@Body('bulk') ads: Partial<AdDTO>[], @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO) {
    return this.adService.bulkPatch({ ads, workspace });
  }
}
