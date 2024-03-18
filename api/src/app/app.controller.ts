import { Controller, Get } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { config } from '@instigo-app/api-shared';
@Controller()
export class AppController {
  @Get()
  root() {
    const { packageBody } = config();
    return { status: 'up', version: packageBody.version, visit: 'https://instigo.io/', service: 'api' };
  }
}
