import { FileNestCrudService } from '@api/file-manager/services/file.nestcrud.service';
import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { User } from '@api/user/data/user.entity';
import { DeleteAudiencesException, MissingParameterException } from '@instigo-app/api-shared';
import {
  Actions,
  AudienceDto,
  AudienceTrackerDto,
  CSVTemplateTypes,
  Resources,
  SupportedProviders,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { Action, Crud, CrudController, Override, ParsedBody } from '@nestjsx/crud';
import to from 'await-to-js';
import { CheckAudienceIdsFilter } from '../data/audience-ids';
import { Audience } from '../data/audience.entity';
import { AudienceNestCrudService } from '../services/audience.nestcrud.service';
import PromisePool from '@supercharge/promise-pool';

@Crud({
  model: {
    type: AudienceDto,
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
        allow: ['id'],
      },
      lookalikeAudiences: {
        eager: true,
        select: false,
        allow: ['id'],
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.AUDIENCES })
export class AudienceController implements CrudController<Audience> {
  logger = new Logger(AudienceController.name);

  constructor(public service: AudienceNestCrudService, private readonly fileService: FileNestCrudService) {}

  @Action(Actions.CreateOne)
  @Override('createOneBase')
  async createAudience(@ParsedBody() audience: Partial<AudienceDto>): Promise<AudienceDto> {
    return this.service.create(audience);
  }

  @Action(Actions.CreateMany)
  @Override('createManyBase')
  async createAudiences(@ParsedBody() { bulk: audiences }: { bulk: Partial<AudienceDto>[] }): Promise<AudienceDto[]> {
    return Promise.all(audiences.map((audience) => this.service.create(audience)));
  }

  @Action(Actions.DeleteOne)
  @Override('deleteOneBase')
  async deleteAudience(@Param('id') audienceId: string): Promise<{ id: string }> {
    return { id: await this.service.deleteById(audienceId) };
  }

  @Action(Actions.DeleteAll)
  @Delete()
  async deleteManyAudiences(
    @Query(new ValidationPipe({ transform: true })) filter: CheckAudienceIdsFilter,
  ): Promise<string[]> {
    if (!filter.audienceIds || !filter.audienceIds.length) {
      throw new MissingParameterException({ parameter: 'adTemplateIds list' });
    }
    const { results, errors } = await new PromisePool().for(filter.audienceIds).process(async (audienceId: string) => {
      const [err, result] = await to(this.service.deleteById(audienceId));
      if (err) {
        this.logger.error(err);
        throw err;
      }
      return result;
    });
    if (errors.length > 0) {
      this.logger.error(errors);
      throw new DeleteAudiencesException({ message: errors[0].message });
    }
    return results;
  }

  @ApiResponse({
    status: 200,
    description: 'Create a pixel or a tracker',
    type: AudienceTrackerDto,
  })
  @Action(Actions.CreateOne)
  @Post('trackers')
  async createTracker(
    @CurrentWorkspaceId() workspaceId: string,
    @Query('provider') provider: SupportedProviders,
    @Query('adAccountProviderId') adAccountProviderId: string,
    @Body('name') name: string,
  ) {
    return this.service.createTracker({ workspaceId, provider, adAccountProviderId, name });
  }

  @ApiResponse({
    status: 200,
    description: 'Search audience trackers given a provider',
    type: AudienceTrackerDto,
    isArray: true,
  })
  @Action(Actions.ReadAll)
  @Get('trackers')
  async findTrackers(
    @Query('provider') provider: SupportedProviders,
    @Query('adAccountProviderId') adAccountProviderId: string,
    @CurrentWorkspaceId() workspaceId: string,
  ) {
    return this.service.findTrackers({ adAccountProviderId, provider, workspaceId });
  }

  @ApiResponse({ status: 200, description: 'Get CSV template to create an audience from', type: String })
  @Action(Actions.ReadOne)
  @Get('template')
  async getTemplate(
    @Query('provider') provider: SupportedProviders,
    @Query('type') type?: CSVTemplateTypes,
  ): Promise<string> {
    return this.service.getTemplate({ provider, type });
  }

  @ApiResponse({ status: 200, description: 'Add audience members by list' })
  @Action(Actions.CreateOne)
  @Post(':id/add-list')
  @UseInterceptors(FileInterceptor('file'))
  async addList(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') audienceId: string,
    @CurrentWorkspaceId() workspaceId: string,
    @CurrentUser() user: Partial<User>,
  ) {
    const savedFile = await this.fileService.save({ file, user, workspaceId });
    const success = await this.service.addList({ audienceId, file: savedFile });
    return { success };
  }

  @ApiResponse({ status: 200, description: 'Remove audience members by list' })
  @Action(Actions.DeleteOne)
  @Post(':id/remove-list')
  @UseInterceptors(FileInterceptor('file'))
  async removeList(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') audienceId: string,
    @CurrentWorkspaceId() workspaceId: string,
    @CurrentUser() user: Partial<User>,
  ) {
    const savedFile = await this.fileService.save({ file, user, workspaceId });
    const success = await this.service.removeList({ audienceId, file: savedFile });
    return { success };
  }

  @Patch('bulk')
  @Action(Actions.UpdateMany)
  @ApiResponse({ status: 201, description: 'Patch multiple audiences' })
  async bulkPatch(
    @Body('bulk') audiences: Partial<AudienceDto>[],
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ) {
    return this.service.bulkPatch({ audiences, workspace });
  }
}
