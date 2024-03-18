import { cert } from '@instigo-app/api-shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as chalk from 'chalk';
import { ConnectionOptions } from 'typeorm';

export const EncryptionTransformerConfig = {
  secretKey: new ConfigService().get<string>('ENCRYPTION_KEY') || 'key-secret',
};

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(DatabaseConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  logDatabaseInfo() {
    this.logger.log(
      chalk.blue.bold(
        `💾 Database ${JSON.stringify({
          url: this.configService.get<string>('DATABASE_URL'),
        })}`,
      ),
    );
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    this.logDatabaseInfo();
    const ssl = this.configService.get<string>('TYPEORM_SSL');
    let config = {
      type: 'postgres',
      url: this.configService.get<string>('DATABASE_URL'),
      // synchronize: true, // TODO! remove this
      autoLoadEntities: true,
      logging: true,
      logger: 'file',
    };
    if (ssl === 'true' || ssl === 'TRUE') {
      config = {
        ...config,
        ssl: {
          ca: cert(),
        },
      } as any;
    }
    return config as ConnectionOptions;
  }
}
