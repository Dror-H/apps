import { Test } from '@nestjs/testing';
import { DatabaseConfigService } from './database.config.service';

describe('DatabaseConfigService  Test suite', () => {
  let service: DatabaseConfigService;
  let configService: any;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DatabaseConfigService, { provide: 'ConfigService', useValue: {} }],
    }).compile();

    service = module.get<DatabaseConfigService>(DatabaseConfigService);
    configService = module.get<any>('ConfigService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should createTypeOrmOptions', () => {
    configService.get = jest.fn((key: string) => {
      if (key === 'TYPEORM_SSL') {
        return false;
      }
      if (key === 'DATABASE_URL') {
        return 'localhost';
      }
      return null;
    });
    const options = service.createTypeOrmOptions();
    expect(options).toEqual({
      autoLoadEntities: true,
      logger: 'file',
      logging: true,
      type: 'postgres',
      url: 'localhost',
    });
  });
  it('should createTypeOrmOptions', () => {
    configService.get = jest.fn((key: string) => {
      if (key === 'TYPEORM_SSL') {
        return 'true';
      }
      if (key === 'DATABASE_URL') {
        return 'localhost';
      }
      return null;
    });

    const options = service.createTypeOrmOptions();
    expect(options).toEqual({
      autoLoadEntities: true,
      logger: 'file',
      logging: true,
      ssl: {
        ca: expect.any(String),
      },
      type: 'postgres',
      url: 'localhost',
    });
  });
});
