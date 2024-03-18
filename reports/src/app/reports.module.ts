import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService, UploadUtilityModule } from '@instigo-app/upload-utility';
import { EmailModule } from '@instigo-app/email';
import { AdAccountOverviewService } from './ad-account-overview.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    EmailModule,
    UploadUtilityModule,
    ThirdPartyApiIntegrationModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, AdAccountOverviewService],
})
export class ReportsModule {}
