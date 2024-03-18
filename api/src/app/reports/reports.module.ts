import { AdAccountModule } from '@api/ad-account/ad-account.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { ReportsController } from './reports.controller';
import { ReportsService } from './repots.service';

@Module({
  imports: [
    AdAccountModule,
    ClientsModule.register([
      {
        name: 'REPORTS_MICRO',
      },
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    {
      provide: 'REPORTS_MICRO',
      useFactory: (configService: ConfigService) => {
        const url = configService.get('REDIS_URL');
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            url,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class ReportsModule {}
