import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

const configService = new ConfigService();

export class MockTypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: configService.get<string>('DATABASE_URL'),
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    };
  }
}

export const mockTypeOrmConfigService = new MockTypeOrmConfigService();
