import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { MissingParameterException } from '@instigo-app/api-shared';
import { Actions, Resources } from '@instigo-app/data-transfer-object';
import {
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { Action, Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { Response } from 'express';
import { CheckFileIdsFilter } from '../data/file-ids';
import { File } from '../data/file.entity';
import { FileNestCrudService } from '../services/file.nestcrud.service';
import { CondOperator } from '@nestjsx/crud-request';

@Crud({
  model: {
    type: File,
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
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
        select: false,
        alias: 'workspace',
        allow: ['id', 'name'],
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.FILES })
export class FileController implements CrudController<File> {
  logger = new Logger(FileController.name);

  constructor(public service: FileNestCrudService) {}

  @ApiResponse({ status: 200, description: 'Upload file' })
  @Action(Actions.CreateOne)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentWorkspaceId() workspaceId: string,
    @CurrentUser() user,
  ): Promise<File> {
    return this.service.save({ file, user, workspaceId });
  }

  @ApiResponse({ status: 200, description: 'Download file', type: Buffer })
  @Action(Actions.ReadOne)
  @Get('download/:id')
  async download(@Param('id') id: string, @Res() response: Response): Promise<Response<Buffer>> {
    const buffer = await this.service.download(id);
    return response.send(buffer);
  }

  @Override()
  @Action(Actions.ReadAll)
  getMany(@ParsedRequest() request: CrudRequest, @CurrentWorkspaceId() workspaceId: string) {
    request.parsed.search.$and.push({
      ['workspace.id']: {
        [CondOperator.EQUALS]: workspaceId,
      },
    });
    return this.service.getMany(request);
  }

  @Action(Actions.DeleteOne)
  @Override('deleteOneBase')
  async deleteAudience(@Param('id') id: string): Promise<{ id: string }> {
    return { id: await this.service.delete(id) };
  }

  @Action(Actions.DeleteAll)
  @Delete()
  async deleteManyFiles(@Query(new ValidationPipe({ transform: true })) filter: CheckFileIdsFilter): Promise<string[]> {
    if (!filter.fileIds || !filter.fileIds.length) {
      throw new MissingParameterException({ parameter: 'fileIds list' });
    }
    return (
      await Promise.all(
        filter.fileIds.map(async (fileId) => {
          try {
            return await this.service.delete(fileId);
          } catch (error) {
            this.logger.error(error);
            return null;
          }
        }),
      )
    ).filter((id) => id !== null);
  }
}
