import { ControllerDecoratorWithGuardsAndSwagger, CurrentUser } from '@instigo-app/api-shared';
import { Resources } from '@instigo-app/data-transfer-object';
import { Get, Inject } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@ControllerDecoratorWithGuardsAndSwagger({ resource: Resources.INVOICES, apiTag: 'me', controller: 'me/invoices' })
export class InvoiceController {
  @Inject(InvoiceService)
  private readonly invoiceService: InvoiceService;

  @Get()
  invoice(@CurrentUser() user: { id: string }): Promise<any> {
    return this.invoiceService.invoice({ user: user });
  }
}
