import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { MeService } from '@audiences-api/auth/me.service';
import { UpdateUserDTO, UserDTO } from '@audiences-api/zod-schemas';
import { ControllerDecoratorWithGuardsAndSwagger, CurrentUser } from '@instigo-app/api-shared';
import { Actions, Resources, ResponseError, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Body, Delete, Inject, Put, UsePipes } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@ControllerDecoratorWithGuardsAndSwagger({ resource: Resources.ME })
@UsePipes(ZodValidationPipe)
export class MeController {
  @Inject(MeService)
  private readonly meService: MeService;

  @Action(Actions.UpdateOne)
  @ApiResponse({ status: 200, description: 'Update Me' })
  @Put()
  update(@CurrentUser() user: { id: string }, @Body() body: UpdateUserDTO): Promise<UserDTO> {
    return this.meService.updateMe({ id: user.id, user: body });
  }

  @Action(Actions.DeleteOne)
  @Delete()
  @ApiResponse({ status: 200, description: 'Delete Me' })
  delete(@CurrentUser() user: { id: string }): Promise<ResponseSuccess | ResponseError> {
    return this.meService.deleteMe({ id: user.id });
  }
}
