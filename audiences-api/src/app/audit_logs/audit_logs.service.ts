import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
export const LOG_AUDIT = 'log.audit';
export class AuditLog {
  environment: string;
  context: string;
  payload: any;

  constructor(options: { context: string; payload: any }) {
    this.context = options.context;
    this.payload = options.payload;
    this.environment = process.env.ENVIRONMENT || 'local';
  }
}
@Injectable()
export class AuditLogsService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  private logger = new Logger(AuditLogsService.name);

  @OnEvent(LOG_AUDIT, { async: true })
  saveLog(payload: AuditLog): void {
    this.logger.log(payload);
    // await this.prismaService.auditLog.create({
    //   data: {
    //     context: payload.context,
    //     payload: payload.payload,
    //     environment: payload.environment,
    //   },
    // });
  }
}
