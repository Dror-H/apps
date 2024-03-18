import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, DatabasePool, Query, QueryContext, SlonikError } from 'slonik';

import { stringify } from 'safe-stable-stringify';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger('DatabaseService');

  audiences: DatabasePool;
  instigo: DatabasePool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing database service');
    const audiences = this.configService.get<string>('AUDIENCES_DATA_BASE');
    const instigo = this.configService.get<string>('INSTIGO_DATA_BASE');
    this.logger.log(`💾  connecting to ${audiences}`);
    this.logger.log(`💾  connecting to ${instigo}`);
    const config = {
      idleTimeout: 30000,
      maximumPoolSize: 50,
      minimumPoolSize: 1,
      interceptors: [
        {
          queryExecutionError: (_context: QueryContext, query: Query, error: SlonikError): Promise<any> => {
            this.logger.error('Slonik Error', { ...query, values: stringify(query?.values) }, error);
            return null;
          },
        },
      ],
    };
    this.audiences = await createPool(audiences, config);
    this.instigo = await createPool(instigo, config);
  }
}
