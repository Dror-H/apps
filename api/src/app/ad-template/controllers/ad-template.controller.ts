import { File } from '@api/file-manager/data/file.entity';
import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { MissingParameterException } from '@instigo-app/api-shared';
import {
  Actions,
  AdAccountDTO,
  AdTemplateDataType,
  AdTemplateDTO,
  AdTemplatePreviewDto,
  AdTemplateType,
  LinkedinImageDto,
  LinkedinMediaUploadResponse,
  Resources,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { Body, Delete, Inject, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Action, Crud, CrudAuth, CrudController, Override } from '@nestjsx/crud';
import { CheckAdTemplateIdsFilter } from '../data/ad-template-ids';
import { AdTemplateNestCrudService } from '../services/ad-template.nestcrud.service';
import { AdTemplateService } from '../services/ad-template.service';

@Crud({
  model: {
    type: AdTemplateDTO,
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
        alias: 'workspace',
        allow: ['id'],
      },
      adAccount: {
        eager: true,
        alias: 'adAccount',
        allow: ['id', 'provider', 'providerId', 'name', 'businessProfilePicture'],
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
@CompositionDecorator({ resource: Resources.AD_TEMPLATES })
export class AdTemplateController implements CrudController<AdTemplateDTO> {
  @Inject(AdTemplateService)
  private readonly adTemplateService: AdTemplateService;

  constructor(public service: AdTemplateNestCrudService) {}

  @ApiResponse({
    status: 200,
    description: 'Get an ad preview that will be used as template',
  })
  @ApiBody({ type: () => AdTemplatePreviewDto })
  @Action(Actions.ReadOne)
  @Post('preview')
  preview(
    @Body() body: { adAccount: AdAccountDTO; adTemplateData: AdTemplateDataType; adTemplateType: AdTemplateType },
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
  ): Promise<{ body: string }> {
    const { adAccount, adTemplateData, adTemplateType } = body;
    return this.adTemplateService.preview({ adAccount, adTemplateData, adTemplateType, workspace: currentWorkspace });
  }

  @Action(Actions.UpdateOne)
  @Post('upload-image')
  async uploadImage(
    @Body() body: { adAccount: AdAccountDTO; image: LinkedinImageDto },
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
  ): Promise<LinkedinMediaUploadResponse> {
    const { adAccount, image } = body;
    return this.adTemplateService.uploadImage({ workspace: currentWorkspace, adAccount, image });
  }

  @Action(Actions.UpdateOne)
  @Post('upload-video')
  uploadVideo(
    @Body() body: any,
    @CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO,
  ): Promise<File> {
    const { adAccount, video } = body;
    return this.adTemplateService.uploadVideo({ workspace: currentWorkspace, adAccount, video });
  }

  @Action(Actions.DeleteOne)
  @Override('deleteOneBase')
  async deleteAdTemplate(@Param('id') adTemplateId: string): Promise<{ id: string }> {
    await this.service.deleteById(adTemplateId);
    return { id: adTemplateId };
  }

  @Action(Actions.DeleteAll)
  @Delete()
  async deleteAdTemplates(
    @Query(new ValidationPipe({ transform: true })) filter: CheckAdTemplateIdsFilter,
  ): Promise<string[]> {
    if (!filter.adTemplateIds || !filter.adTemplateIds.length) {
      throw new MissingParameterException({ parameter: 'adTemplateIds list' });
    }
    await this.service.deleteByIds(filter.adTemplateIds);
    return filter.adTemplateIds;
  }
}
