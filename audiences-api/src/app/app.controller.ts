import { config } from '@instigo-app/api-shared';
import { Controller, Get, Inject } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
@Controller()
export class AppController {
  @Inject(HealthCheckService)
  private readonly health: HealthCheckService;
  @Inject(MemoryHealthIndicator)
  private readonly memory: MemoryHealthIndicator;
  @Inject(DiskHealthIndicator)
  private readonly disk: DiskHealthIndicator;
  @Inject(HttpHealthIndicator)
  private http: HttpHealthIndicator;

  @Get()
  root() {
    const { packageBody } = config();
    return { version: packageBody.version, visit: 'https://instigo.io/', service: 'audiences-api' };
  }

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 100 * 1024 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          thresholdPercent: 0.9,
          path: '/',
        }),
    ]);
  }
}
