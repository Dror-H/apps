import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { MeDTO } from '@audiences-api/zod-schemas';
import { ControllerDecoratorWithGuardsAndSwagger, CurrentUser } from '@instigo-app/api-shared';
import { Resources } from '@instigo-app/data-transfer-object';
import { Get, Inject, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { MeService } from './me.service';

@ControllerDecoratorWithGuardsAndSwagger({ resource: Resources.ME })
@UsePipes(ZodValidationPipe)
export class MeController {
  @Inject(MeService)
  private readonly meService: MeService;

  @Get('/')
  @ApiCreatedResponse({
    type: MeDTO,
  })
  async me(@CurrentUser() user: { id: string }): Promise<MeDTO> {
    return await this.meService.me({ id: user.id });
  }
}
