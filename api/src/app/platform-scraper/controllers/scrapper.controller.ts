import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Resources } from '@instigo-app/data-transfer-object';
import { Inject, Param, Put } from '@nestjs/common';
import { DataSynchronizationService } from '../services/datasync.service';
@CompositionDecorator({ resource: Resources.WORKSPACES })
export class ScrapperController {
  @Inject(DataSynchronizationService)
  private readonly dataSynchronizationService: DataSynchronizationService;

  @Put(':id/sync')
  syncData(@Param('id') id: string) {
    return this.dataSynchronizationService.synchronizeWorkspace({ workspace: { id } });
  }
}
